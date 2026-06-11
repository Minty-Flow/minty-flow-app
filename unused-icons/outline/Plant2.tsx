import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPlant2 = (props: SvgProps) => (
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
    <Path d="M2 9a10 10 0 1 0 20 0" />
    <Path d="M12 19a10 10 0 0 1 10 -10" />
    <Path d="M2 9a10 10 0 0 1 10 10" />
    <Path d="M12 4a9.7 9.7 0 0 1 2.99 7.5" />
    <Path d="M9.01 11.5a9.7 9.7 0 0 1 2.99 -7.5" />
  </Svg>
);
export default SvgPlant2;
