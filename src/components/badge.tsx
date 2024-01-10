interface BadgeProps {
  text: string;
  color: string;
}

export function Badge(props: BadgeProps) {
  return (
    <div class="button-default">
      <span class="data-type box near before:bg-gradient-to-r before:from-gray-400 before:to-white">
        {props.text}
      </span>
    </div>
  );
}
