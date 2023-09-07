import React from 'react';

const Content = ({ content, highlightedPortions }) => {
  const highlightedArray = [];
  const sortedArr = highlightedPortions.sort(
    (a, b) => content.indexOf(a) - content.indexOf(b),
  );
  const startingRange = !sortedArr.length ? 0 : content.indexOf(sortedArr[0]);
  const endingRange = !sortedArr.length ? 0 : content.indexOf(sortedArr[sortedArr.length - 1])
    + sortedArr[sortedArr.length - 1].length;
  sortedArr.forEach((highlightedPortion) => {
    const highlights = highlightedPortion.replaceAll('\\n \\n', '\n \n').split('\n \n').filter((str) => str !== ' ' && str !== '  ');
    highlights.forEach((highlight) => highlightedArray.push(highlight.trim().replaceAll('\\n', '')));
  });
  const highlightsArray = highlightedArray.filter((trimmedSegment) => trimmedSegment !== '');
  const segments = content?.replaceAll('\\n \\n', '\n \n').split('\n \n').filter((str) => str !== ' ' && str !== '  ');
  const trimmedSegments = [];
  segments.forEach((segment) => {
    trimmedSegments.push(segment.trim().replaceAll('\\n', ''));
  });
  const trimmedArray = trimmedSegments.filter((trimmedSegment) => trimmedSegment !== '');
  const highlightedSegments = trimmedArray.map((segment) => {
    let highlighted;
    let intermediate = true;
    let startingHighlightRange = false;
    const positions = [];
    highlightsArray.forEach((highlight) => {
      if ((content.indexOf(segment) + segment.indexOf(highlight) >= startingRange
        && content.indexOf(segment) + segment.indexOf(highlight) <= endingRange)) {
        if (segment.includes(highlight)) {
          highlighted = segment.includes(highlight);
          const startingIndex = segment.indexOf(highlight);
          const obj = {
            start: startingIndex,
            end: startingIndex + highlight.length,
            highlight,
            segment,
            length: segment.length,
            posStart: content.indexOf(segment),
            startingRange,
            endingRange,
          };
          positions.push(obj);
        }
      } else if (segment === highlight) {
        highlighted = segment.includes(highlight);
        const startingIndex = segment.indexOf(highlight);
        const obj = {
          start: startingIndex,
          end: startingIndex + highlight.length,
          highlighted,
          highlight,
          segment,
          length: segment.length,
          posStart: content.indexOf(segment),
          startingRange,
          endingRange,
        };
        positions.push(obj);
      }
    });
    for (let i = 0; i < positions.length; i += 1) {
      if (positions[i].end === segment.length) {
        intermediate = false;
        break;
      }
    }
    for (let i = 0; i < positions.length; i += 1) {
      if (positions[i].start === 0) {
        startingHighlightRange = true;
        break;
      }
    }
    return highlighted ? (
      <div style={{ marginBottom: '10px' }}>
        {!startingHighlightRange ? <span>{segment.substring(0, positions[0].start)}</span> : <span style={{ backgroundColor: 'yellow' }}>{segment.substring(0, positions[0].start)}</span>}

        {positions.map((pos, index) => (
          <>
            {(positions[index - 1] && pos.start - positions[index - 1].end < 1)
              ? (
                <span>
                  {pos.end > positions[index - 1].end
                    ? <span style={{ backgroundColor: 'yellow' }}>{(segment.substring(pos.start, pos.end)).replace(segment.substring(pos.start, positions[index - 1].end), '')}</span>
                    : null}
                </span>
              )
              : <span style={{ backgroundColor: 'yellow' }}>{segment.substring(pos.start, pos.end)}</span>}
            {(positions[index + 1] && positions[index + 1].start - pos.end !== 1)
              && (positions[index + 1] && positions[index + 1].start - pos.end > 1)
              ? <span>{positions[index + 1].highlighted ? <span>{segment.substring(pos.end, positions[index + 1].start)}</span> : <span style={{ backgroundColor: 'yellow' }}>{segment.substring(pos.end, positions[index + 1].start)}</span>}</span> : null}
          </>
        ))}
        {segment.length - 1 - positions[positions.length - 1].end > 1 && intermediate
          && (
            <span>
              {segment.substring(positions[positions.length - 1].end, segment.length - 1)}
            </span>
          )}

      </div>
    ) : (
      <div style={{ marginBottom: '10px' }}>{segment}</div>
    );
  });
  return (
    <div>
      {highlightedSegments}

    </div>
  );
};

export default Content;
