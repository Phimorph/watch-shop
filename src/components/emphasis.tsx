import { Fragment } from 'react'

/**
 * Renders editor text where `*word*` becomes italic and each new line a line break.
 * Plain text in, React elements out: no HTML from the CMS is ever injected.
 */
export function Emphasis({ text }: { text: string }) {
  return text.split('\n').map((line, lineIndex) => (
    <Fragment key={lineIndex}>
      {lineIndex > 0 && <br />}
      {line.split(/(\*[^*]+\*)/).map((part, index) =>
        part.startsWith('*') && part.endsWith('*') && part.length > 2 ? (
          <em key={index}>{part.slice(1, -1)}</em>
        ) : (
          part
        ),
      )}
    </Fragment>
  ))
}
