import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAmbulance = (props: SvgProps) => (
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
    <Path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M5 17h-2v-11a1 1 0 0 1 1 -1h9v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" />
    <Path d="M6 10h4m-2 -2v4" />
  </Svg>
);
export default SvgAmbulance;
