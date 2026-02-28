import type { ComponentChildren } from "preact";
import { Head } from "fresh/runtime";

interface CharacterPageLayoutProps {
  title: string;
  backHref?: string;
  backLabel?: string;
  children: ComponentChildren;
}

export default function CharacterPageLayout(props: CharacterPageLayoutProps) {
  return (
    <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <Head>
        <title>{props.title}</title>
      </Head>
      <div class="max-w-3xl mx-auto space-y-4">
        {props.backHref && props.backLabel && (
          <a href={props.backHref} class="underline">
            ← {props.backLabel}
          </a>
        )}
        {props.children}
      </div>
    </div>
  );
}
