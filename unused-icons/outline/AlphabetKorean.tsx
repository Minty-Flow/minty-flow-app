import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAlphabetKorean = (props: SvgProps) => (
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
    <Path d="M7 7h6c0 2.5 -1.593 8.474 -6 10" />
    <Path d="M16 5v14l0 -14" />
    <Path d="M16 12h2" />
  </Svg>
);
export default SvgAlphabetKorean;
