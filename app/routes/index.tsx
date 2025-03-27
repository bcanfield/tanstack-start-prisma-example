import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getPosts = createServerFn({ method: "GET" }).handler(async () => {
  return prisma.post.findMany();
});

const createPost = createServerFn({ method: "POST" })
  .validator((d: { title: string; content: string }) => d)
  .handler(async ({ data }) => {
    await prisma.post.create({ data });
  });

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => await getPosts(),
});

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();

  return (
    <div>
      <button
        onClick={() => {
          createPost({ data: { title: "Hello", content: "World" } }).then(
            () => {
              router.invalidate();
            }
          );
        }}
      >
        Create Post
      </button>
      <h1>Posts</h1>
      <ul>
        {state.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
