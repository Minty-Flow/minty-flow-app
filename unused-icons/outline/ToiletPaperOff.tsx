import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgToiletPaperOff = (props: SvgProps) => (
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
    <Path d="M4.27 4.28c-.768 1.27 -1.27 3.359 -1.27 5.72c0 3.866 1.343 7 3 7s3 -3.134 3 -7c0 -.34 -.01 -.672 -.03 -1" />
    <Path d="M21 10c0 -3.866 -1.343 -7 -3 -7" />
    <Path d="M7 3h11" />
    <Path d="M21 10v7m-1.513 2.496l-1.487 -.496l-3 2l-3 -3l-3 2v-10" />
    <Path d="M6 10h.01" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgToiletPaperOff;
