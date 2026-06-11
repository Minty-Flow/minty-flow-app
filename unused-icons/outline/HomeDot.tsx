import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHomeDot = (props: SvgProps) => (
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
    <Path d="M19 12h2l-9 -9l-9 9h2v7a2 2 0 0 0 2 2h5" />
    <Path d="M16 19a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M9 21v-6a2 2 0 0 1 2 -2h2c.641 0 1.212 .302 1.578 .771" />
  </Svg>
);
export default SvgHomeDot;
