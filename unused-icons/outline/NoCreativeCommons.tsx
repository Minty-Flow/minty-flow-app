import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgNoCreativeCommons = (props: SvgProps) => (
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
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M10.5 10.5c-.847 -.71 -2.132 -.658 -2.914 .116a1.928 1.928 0 0 0 0 2.768c.782 .774 2.067 .825 2.914 .116" />
    <Path d="M16.5 10.5c-.847 -.71 -2.132 -.658 -2.914 .116a1.928 1.928 0 0 0 0 2.768c.782 .774 2.067 .825 2.914 .116" />
    <Path d="M6 6l1.5 1.5" />
    <Path d="M16.5 16.5l1.5 1.5" />
  </Svg>
);
export default SvgNoCreativeCommons;
