import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandFeedly = (props: SvgProps) => (
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
    <Path d="M7.833 12.278l4.445 -4.445" />
    <Path d="M10.055 14.5l2.223 -2.222" />
    <Path d="M12.278 16.722l.555 -.555" />
    <Path d="M19.828 14.828a4 4 0 0 0 0 -5.656l-5 -5a4 4 0 0 0 -5.656 0l-5 5a4 4 0 0 0 0 5.656l6.171 6.172h3.314l6.171 -6.172" />
  </Svg>
);
export default SvgBrandFeedly;
