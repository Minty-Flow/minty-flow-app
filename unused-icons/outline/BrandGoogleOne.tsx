import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandGoogleOne = (props: SvgProps) => (
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
    <Path d="M11 5v13.982a2 2 0 0 0 4 0v-13.982a2 2 0 1 0 -4 0" />
    <Path d="M6.63 8.407a2.125 2.125 0 0 0 -.074 2.944c.77 .834 2.051 .869 2.862 .077l4.95 -4.834c.812 -.792 .846 -2.11 .076 -2.945a1.984 1.984 0 0 0 -2.861 -.077l-4.953 4.835" />
  </Svg>
);
export default SvgBrandGoogleOne;
