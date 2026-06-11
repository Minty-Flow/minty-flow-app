import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandTesla = (props: SvgProps) => (
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
    <Path d="M12 21l3 -11c2.359 0 3 0 3 1c0 0 1.18 -1.745 2 -3c-3.077 -1.464 -6 -1 -6 -1l-2 2l-2 -2s-2.923 -.464 -6 1c.82 1.255 2 3 2 3c0 -1 .744 -1 3 -1l3 11" />
    <Path d="M20 5c-5.114 -2 -10.886 -2 -16 0" />
  </Svg>
);
export default SvgBrandTesla;
