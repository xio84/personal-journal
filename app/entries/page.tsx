import { Card, Title, Text, Grid, Divider, TextInput, Textarea, Button } from '@tremor/react';
import { kv } from '@vercel/kv';
import Search from './search';
import { useFormState, useFormStatus } from 'react-dom';
import { EntryForm } from './form';

export default async function AddPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  // const session = await auth()
  // if (session == null) {
  //   return (
  //     <main className="p-4 md:p-10 mx-auto max-w-7xl">
  //       <Title>Please sign in</Title>
  //       <Text>Sign in to use this feature</Text>
  //     </main>

  //   )
  // }

  const search = searchParams.q ?? '';
  // const entries = await kv.keys('entry:' + session?.user?.name + ':*' + encodeURI(search) + '*')
  const entries = await kv.keys('entry*').then(async (titles) => {
    if (search !== '') {
      titles = titles
        .filter((v) =>
          new RegExp(search.toLowerCase()).test(decodeURI(v).toLowerCase())
        );
    }
    let dtitles = titles
    .map((v) => decodeURI(v))

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

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Journal Entries</Title>
      <Text>All journal entries created</Text>
      <Search />
      <Grid numItemsLg={3} numItemsSm={1} className="gap-2">
        {entries.titles.map((v, i) => {
          let title = v.split(':')[1];
          // title = title.length > 20 ? title.substring(0,17) + '...' : title
          let value = entries.values[i];
          // value = value.length > 100 ? value.substring(0,97) + '...' : value
          return (
            <Card key={i} className="mt-6">
              <Title>{title}</Title>
              <Text>{value}</Text>
            </Card>
          );
        })}
      </Grid>
      <Divider/>
      <Title className='mb-4'>Add entry</Title>
      <EntryForm/>
    </main>
  );
}
