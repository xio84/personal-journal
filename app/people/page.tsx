import { sql } from '@vercel/postgres';
import { kv } from '@vercel/kv';
import { Card, Title, Text, Grid } from '@tremor/react';
import Search from './search';
import UsersTable from './table';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export default async function AddPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const session = null;
  if (session == null) {
    return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <Title>Please sign in</Title>
        <Text>Sign in to use this feature</Text>
      </main>

    )
  }
  const search = searchParams.q ?? '';
  const result = await sql`
    SELECT id, name, username, email 
    FROM users 
    WHERE name ILIKE ${'%' + search + '%'};
  `;
  const users = result.rows as User[];

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Peoples</Title>
      <Text>All contacts created</Text>
      <Search />
      <Grid numItemsLg={3} numItemsSm={1}>
        <Card className="mt-6">
        </Card>        
      </Grid>
      <Card className="mt-6">
        <UsersTable users={users} />
      </Card>
      <Title>Add Contact</Title>
      <Text>Name</Text>

    </main>
  );
}
