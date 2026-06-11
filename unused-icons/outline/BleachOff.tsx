import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBleachOff = (props: SvgProps) => (
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
    <Path d="M5 19h14m1.986 -1.977a2 2 0 0 0 -.146 -.773l-7.1 -12.25a2 2 0 0 0 -3.5 0l-.815 1.405m-1.488 2.568l-4.797 8.277a2 2 0 0 0 1.75 2.75" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgBleachOff;
