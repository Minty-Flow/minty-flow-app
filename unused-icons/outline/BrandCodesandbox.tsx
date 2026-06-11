import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandCodesandbox = (props: SvgProps) => (
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
    <Path d="M20 7.5v9l-4 2.25l-4 2.25l-4 -2.25l-4 -2.25v-9l4 -2.25l4 -2.25l4 2.25l4 2.25" />
    <Path d="M12 12l4 -2.25l4 -2.25" />
    <Path d="M12 12l0 9" />
    <Path d="M12 12l-4 -2.25l-4 -2.25" />
    <Path d="M20 12l-4 2v4.75" />
    <Path d="M4 12l4 2l0 4.75" />
    <Path d="M8 5.25l4 2.25l4 -2.25" />
  </Svg>
);
export default SvgBrandCodesandbox;
