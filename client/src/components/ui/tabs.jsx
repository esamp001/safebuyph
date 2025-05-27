import * as React from 'react';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function Tabs({ defaultValue, className, children, ...props }) {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  const tabsList = React.Children.toArray(children).find((child) => child.type === TabsList);
  const tabsContent = React.Children.toArray(children).find(
    (child) => child.type === TabsContent && child.props.value === activeTab
  );

  return (
    <div className={cn('w-full', className)} {...props}>
      {React.cloneElement(tabsList, { activeTab, setActiveTab })}
      {tabsContent}
    </div>
  );
}

export function TabsList({ children, className, activeTab, setActiveTab, ...props }) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (child.type === TabsTrigger) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        return child;
      })}
    </div>
  );
}
TabsList.displayName = 'TabsList';

export function TabsTrigger({ value, activeTab, setActiveTab, children, className, ...props }) {
  const isActive = activeTab === value;
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isActive ? 'bg-white text-black shadow' : 'bg-transparent',
        className
      )}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  );
}
TabsTrigger.displayName = 'TabsTrigger';

export function TabsContent({ value, children, className, ...props }) {
  return (
    <div className={cn('mt-2', className)} {...props}>
      {children}
    </div>
  );
}
TabsContent.displayName = 'TabsContent';
