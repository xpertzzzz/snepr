import React from "react";
import {
  Link as RRLink,
  useNavigate as rrUseNavigate,
  useParams as rrUseParams,
  useLocation as rrUseLocation,
  Outlet,
  Navigate,
} from "react-router-dom";

export { Outlet, Navigate };

export function useParams<T = Record<string, string>>(): T {
  return rrUseParams() as unknown as T;
}

export function useLocation() {
  return rrUseLocation();
}

export const Link = React.forwardRef<any, any>(({ to, params, search, ...props }, ref) => {
  let target = to;
  if (typeof target === "string" && params && typeof params === "object") {
    Object.entries(params).forEach(([k, v]) => {
      target = target.replace(`$${k}`, String(v)).replace(`:${k}`, String(v));
    });
  }
  if (typeof target === "string" && search && typeof search === "object") {
    const sp = new URLSearchParams();
    Object.entries(search).forEach(([k, v]) => {
      if (v !== undefined && v !== null) sp.set(k, String(v));
    });
    const qs = sp.toString();
    if (qs) target += (target.includes("?") ? "&" : "?") + qs;
  }
  return React.createElement(RRLink, { ref, to: target, ...props });
});
Link.displayName = "CompatLink";

export function useNavigate() {
  const rrNavigate = rrUseNavigate();
  return (to: any, options?: any) => {
    if (typeof to === "object" && to !== null) {
      let target = to.to || "/";
      if (to.params && typeof to.params === "object") {
        Object.entries(to.params).forEach(([k, v]) => {
          target = target.replace(`$${k}`, String(v)).replace(`:${k}`, String(v));
        });
      }
      if (to.search && typeof to.search === "object") {
        const sp = new URLSearchParams();
        Object.entries(to.search).forEach(([k, v]) => {
          if (v !== undefined && v !== null) sp.set(k, String(v));
        });
        const qs = sp.toString();
        if (qs) target += (target.includes("?") ? "&" : "?") + qs;
      }
      return rrNavigate(target, options);
    }
    return rrNavigate(to, options);
  };
}

export type RouteComponent = React.FC<any> & {
  Route: any;
  useParams: () => any;
  useSearch: () => any;
  useRouteContext: () => any;
};

export function createFileRoute(path: string) {
  return (options: { component?: React.ComponentType<any>; [key: string]: any }): RouteComponent => {
    const Component = options.component || (() => null);
    const Wrapped: any = (props: any) => React.createElement(Component, props);
    Wrapped.Route = Wrapped;
    Wrapped.useParams = () => rrUseParams();
    Wrapped.useSearch = () => {
      const loc = rrUseLocation();
      return Object.fromEntries(new URLSearchParams(loc.search));
    };
    Wrapped.useRouteContext = () => ({ queryClient: {} });
    return Wrapped;
  };
}

export function createRootRouteWithContext<T>() {
  return (options: { component?: React.ComponentType<any>; [key: string]: any }): RouteComponent => {
    const Component = options.component || (() => null);
    const Wrapped: any = (props: any) => React.createElement(Component, props);
    Wrapped.Route = Wrapped;
    Wrapped.useParams = () => rrUseParams();
    Wrapped.useSearch = () => {
      const loc = rrUseLocation();
      return Object.fromEntries(new URLSearchParams(loc.search));
    };
    Wrapped.useRouteContext = () => ({ queryClient: {} });
    return Wrapped;
  };
}

export function useRouter() {
  return {
    navigate: () => {},
    invalidate: () => {},
    history: { back: () => window.history.back() },
  };
}

export function redirect(options: { to: string }) {
  return options;
}

export function createRouter(options: any) {
  return options;
}

export function createMemoryHistory() {
  return {};
}

export function HeadContent() {
  return null;
}

export function Scripts() {
  return null;
}
