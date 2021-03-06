import { set } from 'mobx';
import state from '../state';

const posts = {
  unsubscribe: undefined,

  stopReading () {
    if (posts.unsubscribe) {
      posts.unsubscribe();
      posts.unsubscribe = undefined;
    }

    set(state.lists, {
      posts: []
    });
  },

  startReading (where) {
    return new Promise((resolve, reject) => {
      posts.stopReading();

      const api = state.api;

      if (!api) {
        return reject(new Error('Not connected to backend.'));
      }

      api.lists.posts.readAndObserve({
        where
      }).
        started((items, cancel) => {
          set(state.lists, { posts: items });
          posts.unsubscribe = cancel;
          resolve();
        }).
        updated(items => {
          set(state.lists, { posts: items });
        }).
        failed(reject);
    });
  }
};

export default posts;
