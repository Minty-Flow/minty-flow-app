import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgServerless = (props: SvgProps) => (
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
    <Path d="M8 19l3.03 1.748a2 2 0 0 0 1.94 0l6 -3.843a2 2 0 0 0 1.03 -1.753v-6.152l-8 3l-8 3v-6.405c0 -.728 .394 -1.399 1.03 -1.752l6 -3.582a2.05 2.05 0 0 1 2 0l2.97 1.739" />
  </Svg>
);
export default SvgServerless;
