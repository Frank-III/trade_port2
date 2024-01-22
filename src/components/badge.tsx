interface BadgeProps {
  text: string;
  color: string;
}

export function Badge(props: BadgeProps) {
  return (
    <span class="text-base font-normal shadow-[inset_0_0_2px_hsla(0,0%,100%,.3)] p-[5px_15px_5px_15px] rounded-lg">
      <span
        class={`${props.color} rounded-full w-[10px] h-[10px] inline-block mr-[5px]`}
      />
      {props.text}
    </span>
  );
}
