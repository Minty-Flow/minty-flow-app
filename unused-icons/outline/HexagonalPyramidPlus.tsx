import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHexagonalPyramidPlus = (props: SvgProps) => (
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
    <Path d="M18.642 12.04l-5.804 -9.583a.996 .996 0 0 0 -1.676 0l-7.846 12.954a1.988 1.988 0 0 0 .267 2.483l2.527 2.523c.374 .373 .88 .583 1.408 .583h4.982" />
    <Path d="M12 2l-5 18.9" />
    <Path d="M12 2l3.304 12.489" />
    <Path d="M16 19h6" />
    <Path d="M19 16v6" />
  </Svg>
);
export default SvgHexagonalPyramidPlus;
