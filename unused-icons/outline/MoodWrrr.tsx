import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMoodWrrr = (props: SvgProps) => (
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
    <Path d="M12 21a9 9 0 1 1 0 -18a9 9 0 0 1 0 18" />
    <Path d="M8 16l1 -1l1.5 1l1.5 -1l1.5 1l1.5 -1l1 1" />
    <Path d="M8.5 11.5l1.5 -1.5l-1.5 -1.5" />
    <Path d="M15.5 11.5l-1.5 -1.5l1.5 -1.5" />
  </Svg>
);
export default SvgMoodWrrr;
