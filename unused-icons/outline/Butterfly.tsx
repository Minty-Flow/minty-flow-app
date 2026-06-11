import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgButterfly = (props: SvgProps) => (
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
    <Path d="M12 18.176a3 3 0 1 1 -4.953 -2.449l-.025 .023a4.502 4.502 0 0 1 1.483 -8.75c1.414 0 2.675 .652 3.5 1.671a4.5 4.5 0 1 1 4.983 7.079a3 3 0 1 1 -4.983 2.25l-.005 .176" />
    <Path d="M12 19v-10" />
    <Path d="M9 3l3 2l3 -2" />
  </Svg>
);
export default SvgButterfly;
