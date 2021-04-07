import { useKeycloak } from "@react-keycloak/web";
import { useMemo } from "react";

export function useHasRealmHome(role: string) {
  const { keycloak, initialized } = useKeycloak();

  return useMemo(() => {
    if (!initialized || !keycloak.authenticated) {
      return false;
    }
    return keycloak.hasRealmRole(role);
  }, [initialized, keycloak, role]);
}

export function useHasClient(clientName: string) {
  const { keycloak, initialized } = useKeycloak();

  return useMemo(() => {
    if (!initialized || !keycloak.authenticated) {
      return false;
    }
    const countRoles = keycloak.resourceAccess?.[clientName]?.roles?.length;
    return !countRoles ? false : true;
  }, [initialized, keycloak, clientName]);
}
