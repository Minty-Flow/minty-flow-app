import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgZodiacSagittarius = (props: SvgProps) => (
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
    <Path d="M4 20l16 -16" />
    <Path d="M13 4h7v7" />
    <Path d="M6.5 12.5l5 5" />
  </Svg>
);
export default SvgZodiacSagittarius;
