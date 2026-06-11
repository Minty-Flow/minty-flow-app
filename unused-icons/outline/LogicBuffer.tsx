import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLogicBuffer = (props: SvgProps) => (
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
    <Path d="M22 12h-5" />
    <Path d="M2 9h5" />
    <Path d="M2 15h5" />
    <Path d="M7 5l10 7l-10 7l0 -14" />
  </Svg>
);
export default SvgLogicBuffer;
