import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandTabnine = (props: SvgProps) => (
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
    <Path d="M20 12l-12 6.75m12 -6.75l-12 -6.75m12 6.75v-4.527l-8 -4.473l-4 2.25m12 6.75v4.5l-8 4.5l-4 -2.25m0 -13.5l-4 2.222v9.028l4 2.25l12 -6.75" />
  </Svg>
);
export default SvgBrandTabnine;
