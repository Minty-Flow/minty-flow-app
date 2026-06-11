import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPaperBagOff = (props: SvgProps) => (
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
    <Path d="M7.158 3.185c.256 -.119 .542 -.185 .842 -.185h8a2 2 0 0 1 2 2v1.82a5 5 0 0 0 .528 2.236l.944 1.888a5 5 0 0 1 .528 2.236v2.82m-.177 3.824a2 2 0 0 1 -1.823 1.176h-12a2 2 0 0 1 -2 -2v-5.82a5 5 0 0 1 .528 -2.236l1.472 -2.944v-2" />
    <Path d="M13.185 13.173a2 2 0 1 0 2.64 2.647" />
    <Path d="M6 21a2 2 0 0 0 2 -2v-5.82a5 5 0 0 0 -.528 -2.236l-1.472 -2.944" />
    <Path d="M11 7h2" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgPaperBagOff;
