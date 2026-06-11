import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgZodiacScorpio = (props: SvgProps) => (
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
    <Path d="M3 4a2 2 0 0 1 2 2v9" />
    <Path d="M5 6a2 2 0 0 1 4 0v9" />
    <Path d="M9 6a2 2 0 0 1 4 0v10a3 3 0 0 0 3 3h5l-3 -3m0 6l3 -3" />
  </Svg>
);
export default SvgZodiacScorpio;
