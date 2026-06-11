import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBubbleTea2 = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M17.95 9l-1.478 8.69c-.25 1.463 -.374 2.195 -.936 2.631c-1.2 .931 -6.039 .88 -7.172 0c-.562 -.436 -.687 -1.168 -.936 -2.632l-1.478 -8.689" />
    <Path d="M6 9l.514 -1.286a5.908 5.908 0 0 1 10.972 0l.514 1.286" />
    <Path d="M5 9h14" />
    <Path d="M12 9l4 -7" />
    <Path d="M7 14c.593 .642 1.484 1.017 2.5 1c1.016 .017 1.907 -.358 2.5 -1s1.484 -1.017 2.5 -1c1.016 -.017 1.907 .358 2.5 1" />
  </Svg>
);
export default SvgBubbleTea2;
