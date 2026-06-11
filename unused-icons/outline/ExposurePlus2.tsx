import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgExposurePlus2 = (props: SvgProps) => (
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
    <Path d="M12 9a4 4 0 1 1 8 0c0 1.098 -.564 2.025 -1.159 2.815l-6.841 7.185h8" />
    <Path d="M3 12h6" />
    <Path d="M6 9v6" />
  </Svg>
);
export default SvgExposurePlus2;
