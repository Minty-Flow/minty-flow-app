import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandPlanetscale = (props: SvgProps) => (
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
    <Path d="M20.993 11.63a9 9 0 0 1 -9.362 9.362l9.362 -9.362" />
    <Path d="M12 3a9.001 9.001 0 0 1 8.166 5.211l-11.955 11.955a9 9 0 0 1 3.789 -17.166" />
    <Path d="M12 12l-6 6" />
  </Svg>
);
export default SvgBrandPlanetscale;
