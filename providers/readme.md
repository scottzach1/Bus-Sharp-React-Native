# Providers

This directory currently contains the one React provider component for
the project.

| Name         | Explanation                                                                                                                                                                                                                                                                                                         |
|:-------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| UserProvider | The `UserProvider` acts as a React context provider that is exposed to the entire project, encapsulating all components in the `src/App` main component. This component also establishes a listener to observe any changes in the User authentication state performed by the `external/Firebase` library / service. |

