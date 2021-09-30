import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

interface Movie {
  id : number,
  title : string,
  poster_path : string,
  backdrop_path : string,
  release_date : string,
  vote_average : number,
  overview : string,
  original_language : string,
  vote_count : number
};


export const createUser = functions.https.onCall((data, context) => {
    db.collection('users').doc(data.uid).set({
       email : data.email,
       uid : data.uid,
       username : data.username,
       watchlist : [],
       likedComments : [],
       dislikedComments : []
    });
});

export const addMovie = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
          'unauthenticated', 
          'Only users can make a list'
        )
    };

    const user = db.collection('users').doc(context.auth!.uid);
    const doc = await user.get();

    return user.update({
        watchlist : [...doc.data()?.watchlist, data.movie]
    });
});

export const removeMovie = functions.https.onCall(async (data, context) => {
    const user = db.collection('users').doc(context.auth!.uid);
    const doc = await user.get();

    return user.update({
        watchlist : doc.data()!.watchlist.filter((item : Movie) => item.id !== data.id)
    });
});

export const addComment = functions.https.onCall(async (data, context) => {
    const user = db.collection('users').doc(context.auth!.uid);
    const doc = await user.get();

    await db.collection('comments').add({
          username : doc.data()!.username,
          userid : context.auth?.uid,
          movieId : data.movieId,
          email : doc.data()!.email,
          comment : data.comment,
          createdAt : new Date,
          likes : 0,
          dislikes : 0,
          spoiler : data.checkBox
    });
});

export const deleteComment = functions.https.onCall(async (data, context) => {
    const user = db.collection('users').doc(context.auth!.uid);
    const doc = await user.get();

    if(doc.data()!.likedComments.includes(data.id)) {
        await user.update({
            likedComments : doc.data()!.likedComments.filter((id : string) => {
                id !== data.id
            })
        });
    };

    if(doc.data()!.dislikedComments.includes(data.id)) {
        await user.update({
            dislikedComments : doc.data()!.likedComments.filter((id : string) => {
                id !== data.id
            })
        });
    };

    return db.collection('comments').doc(data.id).delete();
})

export const likeComment = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
          'unauthenticated', 
          'Only users can like comments'
        )
    };

    const user = db.collection('users').doc(context.auth!.uid);
    const comment = db.collection('comments').doc(data.id);

    const doc = await user.get();

    if(doc.data()!.dislikedComments.includes(data.id)) {
        await user.update({
            dislikedComments : doc.data()!.dislikedComments.filter((id : string) => {
                id !== data.id
            })
        });
        await comment.update({
            dislikes : admin.firestore.FieldValue.increment(-1)
        });
    };

    await user.update({
        likedComments : [...doc.data()!.likedComments, data.id],
    });

    return comment.update({
        likes : admin.firestore.FieldValue.increment(1)
    });
});

export const unlikeComment = functions.https.onCall(async (data, context) => {
    const user = db.collection('users').doc(context.auth!.uid);
    const comment = db.collection('comments').doc(data.id);

    const doc = await user.get();

    await user.update({
        likedComments : doc.data()!.likedComments.filter((id : string) => {
           id !== data.id
        })
    });

    return comment.update({
        likes : admin.firestore.FieldValue.increment(-1)
    });
});

export const dislikeComment = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
          'unauthenticated', 
          'Only users can dislike comments'
        )
    };

    const user = db.collection('users').doc(context.auth!.uid);
    const comment = db.collection('comments').doc(data.id);

    const doc = await user.get();

    if(doc.data()!.likedComments.includes(data.id)) {
        await user.update({
            likedComments : doc.data()!.likedComments.filter((id : string) => {
                id !== data.id
            })
        });
        await comment.update({
            likes : admin.firestore.FieldValue.increment(-1)
        });
    };

    await user.update({
        dislikedComments : [...doc.data()!.dislikedComments, data.id],
    });

    return comment.update({
        dislikes : admin.firestore.FieldValue.increment(1)
    });
});

export const revertDislike = functions.https.onCall(async (data, context) => {
    const user = db.collection('users').doc(context.auth!.uid);
    const comment = db.collection('comments').doc(data.id);

    const doc = await user.get();
 
    await user.update({
        dislikedComments : doc.data()!.dislikedComments.filter((id : string) => {
            id !== data.id
        })
    });

    return comment.update({
        dislikes : admin.firestore.FieldValue.increment(-1)
    });
});
