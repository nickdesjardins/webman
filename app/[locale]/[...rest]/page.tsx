import { notFound } from "next/navigation";

/** Any path under a valid locale that no route matched renders the locale's not-found page. */
export default function CatchAll() {
  notFound();
}
