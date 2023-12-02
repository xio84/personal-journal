'use server'

import { kv } from '@vercel/kv';

const getEntries = async (search: string) => {
    return kv.keys('entry:*').then(async (titles) => {
        let dtitles = titles
        .map((v) => decodeURI(v))
        if (search !== '') {
          dtitles = titles
            .filter((v) =>
              new RegExp(search.toLowerCase()).test(v.toLowerCase())
            );
        }
    
        if (dtitles.length < 1) {
          return {
            titles: [],
            values: []
          };
        }
    
        const values = await kv.mget(titles);
        return {
          titles: dtitles,
          values: values.map((v) => decodeURI(String(v)))
        };
      });
}

const setEntry = async (prevState: any, formData: FormData) => {
    let title = formData.get('title')
    let journal = formData.get('journal')
    if (!(title && journal)) {
        return {message: 'Incomplete data'}
    }

    title = encodeURI(String(title))
    journal = encodeURI(String(journal))
    return await kv.set("entry:" + title, journal)
    .then(() => {
        return {message: 'success'}
    })
    .catch(() => {
        return {message: 'DB error'}
    })
  }

export {getEntries, setEntry}