import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandMetabrainz = (props: SvgProps) => (
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
    <Path d="M3 7v10l7 4v-18l-7 4" />
    <Path d="M21 7v10l-7 4v-18l7 4" />
  </Svg>
);
export default SvgBrandMetabrainz;
