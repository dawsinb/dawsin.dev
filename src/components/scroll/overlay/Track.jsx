import { useRef, useState } from 'react';
import SectionMarker from 'Components/scroll/overlay/SectionMarker';
import PositionMarker from 'Components/scroll/overlay/PositionMarker';

function Track({ size, offsetDistance, numSections, textToggles, ismobile }) {
  const offsetFactors = [...Array(numSections)].map((_, index) => index - (numSections - 1) / 2);
  const timeoutRef = useRef();
  const [jumpDirection, setJumpDirection] = useState(0);

  const sectionNames = ['', 'about me', 'commercial', 'portfolio', 'research', 'euphony', 'music', ''];
  return (
    <>
      {offsetFactors.map((offsetFactor, index) => (
        <SectionMarker
          key={index}
          isStartEnd={index === 0 || index === offsetFactors.length - 1}
          size={size}
          offset={offsetFactor * offsetDistance}
          breakpoint={index}
          title={sectionNames[index]}
          textToggle={textToggles[index]}
          setJumpDirection={setJumpDirection}
          timeoutRef={timeoutRef}
        />
      ))}

      <PositionMarker
        size={size}
        offsetDistance={offsetDistance}
        numSections={numSections}
        jumpDirection={jumpDirection}
        ismobile={ismobile}
      />
    </>
  );
}

export default Track;
