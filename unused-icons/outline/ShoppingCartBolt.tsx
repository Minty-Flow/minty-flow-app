import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgShoppingCartBolt = (props: SvgProps) => (
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
    <Path d="M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <Path d="M13.5 17h-7.5v-14h-2" />
    <Path d="M6 5l14 1l-.858 6.004m-2.642 .996h-10.5" />
    <Path d="M19 16l-2 3h4l-2 3" />
  </Svg>
);
export default SvgShoppingCartBolt;
