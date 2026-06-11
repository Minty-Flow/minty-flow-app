import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPrism = (props: SvgProps) => (
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
    <Path d="M12 9v13" />
    <Path d="M19 17.17l-5.98 4.485a1.7 1.7 0 0 1 -2.04 0l-5.98 -4.485a2.5 2.5 0 0 1 -1 -2v-11.17a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1v11.17a2.5 2.5 0 0 1 -1 2" />
    <Path d="M4.3 3.3l6.655 5.186a1.7 1.7 0 0 0 2.09 0l6.655 -5.186" />
  </Svg>
);
export default SvgPrism;
