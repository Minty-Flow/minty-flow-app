import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMoodAnnoyed = (props: SvgProps) => (
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
    <Path d="M15 14c-2 0 -3 1 -3.5 2.05" />
    <Path d="M9 10h-.01" />
    <Path d="M15 10h-.01" />
  </Svg>
);
export default SvgMoodAnnoyed;
