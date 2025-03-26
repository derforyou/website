import { useLoaderData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

export async function action({ request, context }: ActionFunctionArgs) {
  return null;
}

export async function loader({ context }: LoaderFunctionArgs) {
  console.log("Hi!");

  return {
    message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
  };
}

export default function Home() {
  const data = useLoaderData<typeof loader>();
  
  return (
    <div className="min-h-svh">
      <h1 className="text-9xl">Dupa</h1>
      <h1>Hi! {data.message}</h1>
    </div>
  );
}
