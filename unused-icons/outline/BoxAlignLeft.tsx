import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBoxAlignLeft = (props: SvgProps) => (
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
    <Path d="M10.002 20.003v-16h-5a1 1 0 0 0 -1 1v14a1 1 0 0 0 1 1h5" />
    <Path d="M15.002 20.003h-.01" />
    <Path d="M20.003 20.003h-.011" />
    <Path d="M20.003 15.002h-.011" />
    <Path d="M20.003 9.002h-.011" />
    <Path d="M20.003 4.002h-.011" />
    <Path d="M15.002 4.002h-.01" />
  </Svg>
);
export default SvgBoxAlignLeft;
