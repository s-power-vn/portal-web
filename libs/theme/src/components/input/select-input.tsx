import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { TextInput } from '@tremor/react';
import * as _ from 'lodash';

import {
  FC,
  Fragment,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { Show, cn } from '@storeo/core';

import { Button } from '../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

type Align = 'start' | 'center' | 'end';

export type SelectInputItem = {
  label: string;
  value: string;
  group?: string;
};

export type ChildrenFunction = (it: SelectInputItem) => ReactNode;

export type SelectInputProps = {
  items: SelectInputItem[];
  value?: string;
  placeholder?: string;
  showGroups?: boolean;
  showSearch?: boolean;
  onChange?: (value: string | undefined) => void;
  onFilter?: (value: string) => void;
  children?: ChildrenFunction;
  className?: string;
  align?: Align;
};

const SelectInputComponent: FC<SelectInputProps> = ({
  items = [],
  value: initialValue,
  placeholder,
  showGroups,
  showSearch,
  onChange,
  onFilter,
  children,
  className,
  align = 'center'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialValue);

  const normalizedItems = useMemo(
    () => _.groupBy(items, it => it.group),
    [items]
  );

  useEffect(() => {
    if (initialValue && !items.find(it => it.value == initialValue)) {
      setValue(undefined);
      onChange?.(undefined);
    }
  }, [items, initialValue]);

  return (
    <div ref={containerRef} className={'flex-1'}>
      <Popover
        open={open}
        onOpenChange={value => {
          onFilter?.('');
          setOpen(value);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'relative w-full justify-between text-sm font-normal',
              placeholder && !value ? 'text-muted-foreground' : 'text-appBlack',
              className
            )}
          >
            <span className="!truncate">
              {value ? items.find(it => it.value == value)?.label : placeholder}
            </span>
            <CaretSortIcon className="absolute right-2 ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="popover-content p-0"
          style={{
            width: containerRef.current?.offsetWidth
          }}
          container={containerRef.current}
          align={align}
        >
          <Command shouldFilter={!onFilter} value={value}>
            {showSearch ? (
              <CommandInput
                placeholder={'Tìm kiếm...'}
                className="h-9"
                onValueChange={onFilter}
              />
            ) : null}
            <CommandList className={'h-48'}>
              <CommandEmpty>Không có dữ liệu.</CommandEmpty>
              {_.keys(normalizedItems).map(key => (
                <Fragment key={key}>
                  <CommandGroup heading={showGroups ? key : undefined}>
                    {normalizedItems[key].map(it => (
                      <CommandItem
                        key={it.value}
                        className={'hover:bg-appGrayLight'}
                        onSelect={() => {
                          setValue(it.value);
                          onChange?.(it.value);
                          setOpen(false);
                        }}
                      >
                        {children ? children(it) : it.label}
                        <CheckIcon
                          className={cn(
                            'ml-auto h-4 w-4',
                            value === it.value ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {showGroups ? <CommandSeparator /> : null}
                </Fragment>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const withSelectInput = (WrappedComponent: typeof SelectInputComponent) => {
  return (props: SelectInputProps) => {
    return (
      <Show
        when={props.items?.length}
        fallback={<TextInput placeholder={props.placeholder} />}
      >
        <WrappedComponent {...props} />
      </Show>
    );
  };
};

export const SelectInput = withSelectInput(SelectInputComponent);
