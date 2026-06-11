import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMoodWink2 = (props: SvgProps) => (
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
    <Path d="M9 10h-.01" />
    <Path d="M14.5 15a3.5 3.5 0 0 1 -5 0" />
    <Path d="M15.5 8.5l-1.5 1.5l1.5 1.5" />
  </Svg>
);
export default SvgMoodWink2;
