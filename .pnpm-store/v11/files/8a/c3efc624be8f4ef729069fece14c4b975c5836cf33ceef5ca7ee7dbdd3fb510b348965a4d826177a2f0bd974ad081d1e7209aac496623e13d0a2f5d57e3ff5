import * as z from "zod/v4";
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Authentication capabilities supported by the client.
 *
 * Advertised during initialization to inform the agent which authentication
 * method types the client can handle. This governs opt-in types that require
 * additional client-side support.
 *
 * @experimental
 */
export declare const zAuthCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    terminal: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Describes a single environment variable for an [`AuthMethodEnvVar`] authentication method.
 *
 * @experimental
 */
export declare const zAuthEnvVar: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    label: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodString;
    optional: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    secret: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
/**
 * Agent handles authentication itself.
 *
 * This is the default authentication method type.
 */
export declare const zAuthMethodAgent: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    id: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Environment variable authentication method.
 *
 * The user provides credentials that the client passes to the agent as environment variables.
 *
 * @experimental
 */
export declare const zAuthMethodEnvVar: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    id: z.ZodString;
    link: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodString;
    vars: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        label: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        optional: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        secret: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Terminal-based authentication method.
 *
 * The client runs an interactive terminal for the user to authenticate via a TUI.
 *
 * @experimental
 */
export declare const zAuthMethodTerminal: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    args: z.ZodOptional<z.ZodArray<z.ZodString>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    id: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
/**
 * Describes an available authentication method.
 *
 * The `type` field acts as the discriminator in the serialized JSON form.
 * When no `type` is present, the method is treated as `agent`.
 */
export declare const zAuthMethod: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    id: z.ZodString;
    link: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodString;
    vars: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        label: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        optional: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        secret: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"env_var">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    args: z.ZodOptional<z.ZodArray<z.ZodString>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    id: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"terminal">;
}, z.core.$strip>>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    id: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>]>;
/**
 * Request parameters for the authenticate method.
 *
 * Specifies which authentication method to use.
 */
export declare const zAuthenticateRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    methodId: z.ZodString;
}, z.core.$strip>;
/**
 * Response to the `authenticate` method.
 */
export declare const zAuthenticateResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * Binary resource contents.
 */
export declare const zBlobResourceContents: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    blob: z.ZodString;
    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    uri: z.ZodString;
}, z.core.$strip>;
/**
 * Schema for boolean properties in an elicitation form.
 */
export declare const zBooleanPropertySchema: z.ZodObject<{
    default: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/**
 * Response from closing an NES session.
 */
export declare const zCloseNesResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * Response from closing a session.
 */
export declare const zCloseSessionResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * Cost information for a session.
 */
export declare const zCost: z.ZodObject<{
    amount: z.ZodNumber;
    currency: z.ZodString;
}, z.core.$strip>;
/**
 * Response containing the ID of the created terminal.
 */
export declare const zCreateTerminalResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    terminalId: z.ZodString;
}, z.core.$strip>;
/**
 * Response from deleting a session.
 */
export declare const zDeleteSessionResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * A diff representing file modifications.
 *
 * Shows changes to files in a format suitable for display in the client UI.
 *
 * See protocol docs: [Content](https://agentclientprotocol.com/protocol/tool-calls#content)
 */
export declare const zDiff: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    newText: z.ZodString;
    oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    path: z.ZodString;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Request parameters for `providers/disable`.
 *
 * @experimental
 */
export declare const zDisableProviderRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    id: z.ZodString;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Response to `providers/disable`.
 *
 * @experimental
 */
export declare const zDisableProviderResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Response to `mcp/disconnect`.
 *
 * @experimental
 */
export declare const zDisconnectMcpResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
export declare const zElicitationContentValue: z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString>]>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * The user accepted the elicitation and provided content.
 *
 * @experimental
 */
export declare const zElicitationAcceptAction: z.ZodObject<{
    content: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString>]>>>>;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Response from the client to an elicitation request.
 *
 * @experimental
 */
export declare const zCreateElicitationResponse: z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
    content: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString>]>>>>;
}, z.core.$strip>, z.ZodObject<{
    action: z.ZodLiteral<"accept">;
}, z.core.$strip>>, z.ZodObject<{
    action: z.ZodLiteral<"decline">;
}, z.core.$strip>, z.ZodObject<{
    action: z.ZodLiteral<"cancel">;
}, z.core.$strip>]>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Form-based elicitation capabilities.
 *
 * @experimental
 */
export declare const zElicitationFormCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Unique identifier for an elicitation.
 *
 * @experimental
 */
export declare const zElicitationId: z.ZodString;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Notification sent by the agent when a URL-based elicitation is complete.
 *
 * @experimental
 */
export declare const zCompleteElicitationNotification: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    elicitationId: z.ZodString;
}, z.core.$strip>;
/**
 * Object schema type.
 */
export declare const zElicitationSchemaType: z.ZodLiteral<"object">;
/**
 * String schema type.
 */
export declare const zElicitationStringType: z.ZodLiteral<"string">;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * URL-based elicitation capabilities.
 *
 * @experimental
 */
export declare const zElicitationUrlCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Elicitation capabilities supported by the client.
 *
 * @experimental
 */
export declare const zElicitationCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    form: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>>>;
    url: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
/**
 * A titled enum option with a const value and human-readable title.
 */
export declare const zEnumOption: z.ZodObject<{
    const: z.ZodString;
    title: z.ZodString;
}, z.core.$strip>;
/**
 * An environment variable to set when launching an MCP server.
 */
export declare const zEnvVariable: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    name: z.ZodString;
    value: z.ZodString;
}, z.core.$strip>;
/**
 * Predefined error codes for common JSON-RPC and ACP-specific errors.
 *
 * These codes follow the JSON-RPC 2.0 specification for standard errors
 * and use the reserved range (-32000 to -32099) for protocol-specific errors.
 */
export declare const zErrorCode: z.ZodUnion<readonly [z.ZodLiteral<-32700>, z.ZodLiteral<-32600>, z.ZodLiteral<-32601>, z.ZodLiteral<-32602>, z.ZodLiteral<-32603>, z.ZodLiteral<-32800>, z.ZodLiteral<-32000>, z.ZodLiteral<-32002>, z.ZodLiteral<-32042>, z.ZodInt]>;
/**
 * JSON-RPC error object.
 *
 * Represents an error that occurred during method execution, following the
 * JSON-RPC 2.0 error object specification with optional additional data.
 *
 * See protocol docs: [JSON-RPC Error Object](https://www.jsonrpc.org/specification#error_object)
 */
export declare const zError: z.ZodObject<{
    code: z.ZodUnion<readonly [z.ZodLiteral<-32700>, z.ZodLiteral<-32600>, z.ZodLiteral<-32601>, z.ZodLiteral<-32602>, z.ZodLiteral<-32603>, z.ZodLiteral<-32800>, z.ZodLiteral<-32000>, z.ZodLiteral<-32002>, z.ZodLiteral<-32042>, z.ZodInt]>;
    data: z.ZodOptional<z.ZodUnknown>;
    message: z.ZodString;
}, z.core.$strip>;
/**
 * Allows the Agent to send an arbitrary notification that is not part of the ACP spec.
 * Extension notifications provide a way to send one-way messages for custom functionality
 * while maintaining protocol compatibility.
 *
 * See protocol docs: [Extensibility](https://agentclientprotocol.com/protocol/extensibility)
 */
export declare const zExtNotification: z.ZodUnknown;
/**
 * Allows for sending an arbitrary request that is not part of the ACP spec.
 * Extension methods provide a way to add custom functionality while maintaining
 * protocol compatibility.
 *
 * See protocol docs: [Extensibility](https://agentclientprotocol.com/protocol/extensibility)
 */
export declare const zExtRequest: z.ZodUnknown;
/**
 * Allows for sending an arbitrary response to an [`ExtRequest`] that is not part of the ACP spec.
 * Extension methods provide a way to add custom functionality while maintaining
 * protocol compatibility.
 *
 * See protocol docs: [Extensibility](https://agentclientprotocol.com/protocol/extensibility)
 */
export declare const zExtResponse: z.ZodUnknown;
/**
 * File system capabilities that a client may support.
 *
 * See protocol docs: [FileSystem](https://agentclientprotocol.com/protocol/initialization#filesystem)
 */
export declare const zFileSystemCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    readTextFile: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    writeTextFile: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
/**
 * An HTTP header to set when making requests to the MCP server.
 */
export declare const zHttpHeader: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    name: z.ZodString;
    value: z.ZodString;
}, z.core.$strip>;
/**
 * Metadata about the implementation of the client or agent.
 * Describes the name and version of an MCP implementation, with an optional
 * title for UI representation.
 */
export declare const zImplementation: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    name: z.ZodString;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    version: z.ZodString;
}, z.core.$strip>;
/**
 * Schema for integer properties in an elicitation form.
 */
export declare const zIntegerPropertySchema: z.ZodObject<{
    default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/**
 * Response to `terminal/kill` method
 */
export declare const zKillTerminalResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Request parameters for `providers/list`.
 *
 * @experimental
 */
export declare const zListProvidersRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * Request parameters for listing existing sessions.
 *
 * Only available if the Agent supports the `sessionCapabilities.list` capability.
 */
export declare const zListSessionsRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    cursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    cwd: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Well-known API protocol identifiers for LLM providers.
 *
 * Agents and clients MUST handle unknown protocol identifiers gracefully.
 *
 * Protocol names beginning with `_` are free for custom use, like other ACP extension methods.
 * Protocol names that do not begin with `_` are reserved for the ACP spec.
 *
 * @experimental
 */
export declare const zLlmProtocol: z.ZodUnion<readonly [z.ZodLiteral<"anthropic">, z.ZodLiteral<"openai">, z.ZodLiteral<"azure">, z.ZodLiteral<"vertex">, z.ZodLiteral<"bedrock">, z.ZodString]>;
/**
 * Logout capabilities supported by the agent.
 *
 * By supplying `{}` it means that the agent supports the logout method.
 */
export declare const zLogoutCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * Authentication-related capabilities supported by the agent.
 */
export declare const zAgentAuthCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    logout: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
/**
 * Request parameters for the logout method.
 *
 * Terminates the current authenticated session.
 */
export declare const zLogoutRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * Response to the `logout` method.
 */
export declare const zLogoutResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * MCP capabilities supported by the agent
 */
export declare const zMcpCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    acp: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    http: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    sse: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * A unique identifier for an active MCP-over-ACP connection.
 *
 * @experimental
 */
export declare const zMcpConnectionId: z.ZodString;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Response to `mcp/connect`.
 *
 * @experimental
 */
export declare const zConnectMcpResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    connectionId: z.ZodString;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Request parameters for `mcp/disconnect`.
 *
 * @experimental
 */
export declare const zDisconnectMcpRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    connectionId: z.ZodString;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Unique identifier for an MCP server using the ACP transport.
 *
 * The value is opaque and generated by the ACP component providing the MCP server. It is
 * used by `mcp/connect` to route connection requests back to the component that declared the
 * server.
 *
 * @experimental
 */
export declare const zMcpServerAcpId: z.ZodString;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Request parameters for `mcp/connect`.
 *
 * @experimental
 */
export declare const zConnectMcpRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    acpId: z.ZodString;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * ACP transport configuration for MCP.
 *
 * The MCP server is provided by an ACP component and communicates over the ACP channel
 * using `mcp/connect`, `mcp/message`, and `mcp/disconnect`.
 *
 * @experimental
 */
export declare const zMcpServerAcp: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    id: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
/**
 * HTTP transport configuration for MCP.
 */
export declare const zMcpServerHttp: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    headers: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$strip>>;
    name: z.ZodString;
    url: z.ZodString;
}, z.core.$strip>;
/**
 * SSE transport configuration for MCP.
 */
export declare const zMcpServerSse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    headers: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$strip>>;
    name: z.ZodString;
    url: z.ZodString;
}, z.core.$strip>;
/**
 * Stdio transport configuration for MCP.
 */
export declare const zMcpServerStdio: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    args: z.ZodArray<z.ZodString>;
    command: z.ZodString;
    env: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$strip>>;
    name: z.ZodString;
}, z.core.$strip>;
/**
 * Configuration for connecting to an MCP (Model Context Protocol) server.
 *
 * MCP servers provide tools and context that the agent can use when
 * processing prompts.
 *
 * See protocol docs: [MCP Servers](https://agentclientprotocol.com/protocol/session-setup#mcp-servers)
 */
export declare const zMcpServer: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    headers: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$strip>>;
    name: z.ZodString;
    url: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"http">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    headers: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$strip>>;
    name: z.ZodString;
    url: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"sse">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    id: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"acp">;
}, z.core.$strip>>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    args: z.ZodArray<z.ZodString>;
    command: z.ZodString;
    env: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$strip>>;
    name: z.ZodString;
}, z.core.$strip>]>;
/**
 * Unique identifier for a message within a session.
 */
export declare const zMessageId: z.ZodString;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Notification parameters for `mcp/message`.
 *
 * This is used when the wrapped MCP message is a notification and the outer JSON-RPC
 * envelope has no `id`.
 *
 * @experimental
 */
export declare const zMessageMcpNotification: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    connectionId: z.ZodString;
    method: z.ZodString;
    params: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Request parameters for `mcp/message`.
 *
 * @experimental
 */
export declare const zMessageMcpRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    connectionId: z.ZodString;
    method: z.ZodString;
    params: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Response to `mcp/message`.
 *
 * This is the inner MCP response result payload. Any JSON value is valid.
 *
 * @experimental
 */
export declare const zMessageMcpResponse: z.ZodUnknown;
/**
 * Severity of a diagnostic.
 */
export declare const zNesDiagnosticSeverity: z.ZodUnion<readonly [z.ZodLiteral<"error">, z.ZodLiteral<"warning">, z.ZodLiteral<"information">, z.ZodLiteral<"hint">]>;
/**
 * Capabilities for diagnostics context.
 */
export declare const zNesDiagnosticsCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * Marker for `document/didClose` capability support.
 */
export declare const zNesDocumentDidCloseCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * Marker for `document/didFocus` capability support.
 */
export declare const zNesDocumentDidFocusCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * Marker for `document/didOpen` capability support.
 */
export declare const zNesDocumentDidOpenCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * Marker for `document/didSave` capability support.
 */
export declare const zNesDocumentDidSaveCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * Capabilities for edit history context.
 */
export declare const zNesEditHistoryCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    maxCount: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
}, z.core.$strip>;
/**
 * An entry in the edit history.
 */
export declare const zNesEditHistoryEntry: z.ZodObject<{
    diff: z.ZodString;
    uri: z.ZodString;
}, z.core.$strip>;
/**
 * A code excerpt from a file.
 */
export declare const zNesExcerpt: z.ZodObject<{
    endLine: z.ZodInt;
    startLine: z.ZodInt;
    text: z.ZodString;
}, z.core.$strip>;
/**
 * Marker for jump suggestion support.
 */
export declare const zNesJumpCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * Capabilities for open files context.
 */
export declare const zNesOpenFilesCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * A recently accessed file.
 */
export declare const zNesRecentFile: z.ZodObject<{
    languageId: z.ZodString;
    text: z.ZodString;
    uri: z.ZodString;
}, z.core.$strip>;
/**
 * Capabilities for recent files context.
 */
export declare const zNesRecentFilesCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    maxCount: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
}, z.core.$strip>;
/**
 * The reason a suggestion was rejected.
 */
export declare const zNesRejectReason: z.ZodUnion<readonly [z.ZodLiteral<"rejected">, z.ZodLiteral<"ignored">, z.ZodLiteral<"replaced">, z.ZodLiteral<"cancelled">]>;
/**
 * A related code snippet from a file.
 */
export declare const zNesRelatedSnippet: z.ZodObject<{
    excerpts: z.ZodArray<z.ZodObject<{
        endLine: z.ZodInt;
        startLine: z.ZodInt;
        text: z.ZodString;
    }, z.core.$strip>>;
    uri: z.ZodString;
}, z.core.$strip>;
/**
 * Capabilities for related snippets context.
 */
export declare const zNesRelatedSnippetsCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * Marker for rename suggestion support.
 */
export declare const zNesRenameCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * Repository metadata for an NES session.
 */
export declare const zNesRepository: z.ZodObject<{
    name: z.ZodString;
    owner: z.ZodString;
    remoteUrl: z.ZodString;
}, z.core.$strip>;
/**
 * Marker for search and replace suggestion support.
 */
export declare const zNesSearchAndReplaceCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * NES capabilities advertised by the client during initialization.
 */
export declare const zClientNesCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    jump: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>>>;
    rename: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>>>;
    searchAndReplace: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
/**
 * A search-and-replace suggestion.
 */
export declare const zNesSearchAndReplaceSuggestion: z.ZodObject<{
    id: z.ZodString;
    isRegex: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    replace: z.ZodString;
    search: z.ZodString;
    uri: z.ZodString;
}, z.core.$strip>;
/**
 * What triggered the suggestion request.
 */
export declare const zNesTriggerKind: z.ZodUnion<readonly [z.ZodLiteral<"automatic">, z.ZodLiteral<"diagnostic">, z.ZodLiteral<"manual">]>;
/**
 * Capabilities for user actions context.
 */
export declare const zNesUserActionsCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    maxCount: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
}, z.core.$strip>;
/**
 * Context capabilities the agent wants attached to each suggestion request.
 */
export declare const zNesContextCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    diagnostics: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>>>;
    editHistory: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        maxCount: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
    }, z.core.$strip>>>>;
    openFiles: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>>>;
    recentFiles: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        maxCount: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
    }, z.core.$strip>>>>;
    relatedSnippets: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>>>;
    userActions: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        maxCount: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
/**
 * Request parameters for creating a new session.
 *
 * See protocol docs: [Creating a Session](https://agentclientprotocol.com/protocol/session-setup#creating-a-session)
 */
export declare const zNewSessionRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    additionalDirectories: z.ZodOptional<z.ZodArray<z.ZodString>>;
    cwd: z.ZodString;
    mcpServers: z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        headers: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>;
        name: z.ZodString;
        url: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"http">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        headers: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>;
        name: z.ZodString;
        url: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"sse">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"acp">;
    }, z.core.$strip>>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        args: z.ZodArray<z.ZodString>;
        command: z.ZodString;
        env: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>;
        name: z.ZodString;
    }, z.core.$strip>]>>;
}, z.core.$strip>;
/**
 * Schema for number (floating-point) properties in an elicitation form.
 */
export declare const zNumberPropertySchema: z.ZodObject<{
    default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/**
 * Unique identifier for a permission option.
 */
export declare const zPermissionOptionId: z.ZodString;
/**
 * The type of permission option being presented to the user.
 *
 * Helps clients choose appropriate icons and UI treatment.
 */
export declare const zPermissionOptionKind: z.ZodUnion<readonly [z.ZodLiteral<"allow_once">, z.ZodLiteral<"allow_always">, z.ZodLiteral<"reject_once">, z.ZodLiteral<"reject_always">]>;
/**
 * An option presented to the user when requesting permission.
 */
export declare const zPermissionOption: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    kind: z.ZodUnion<readonly [z.ZodLiteral<"allow_once">, z.ZodLiteral<"allow_always">, z.ZodLiteral<"reject_once">, z.ZodLiteral<"reject_always">]>;
    name: z.ZodString;
    optionId: z.ZodString;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Capabilities for receiving `plan_update` and `plan_removed` session updates.
 *
 * @experimental
 */
export declare const zPlanCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * Priority levels for plan entries.
 *
 * Used to indicate the relative importance or urgency of different
 * tasks in the execution plan.
 * See protocol docs: [Plan Entries](https://agentclientprotocol.com/protocol/agent-plan#plan-entries)
 */
export declare const zPlanEntryPriority: z.ZodUnion<readonly [z.ZodLiteral<"high">, z.ZodLiteral<"medium">, z.ZodLiteral<"low">]>;
/**
 * Status of a plan entry in the execution flow.
 *
 * Tracks the lifecycle of each task from planning through completion.
 * See protocol docs: [Plan Entries](https://agentclientprotocol.com/protocol/agent-plan#plan-entries)
 */
export declare const zPlanEntryStatus: z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">]>;
/**
 * A single entry in the execution plan.
 *
 * Represents a task or goal that the assistant intends to accomplish
 * as part of fulfilling the user's request.
 * See protocol docs: [Plan Entries](https://agentclientprotocol.com/protocol/agent-plan#plan-entries)
 */
export declare const zPlanEntry: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodString;
    priority: z.ZodUnion<readonly [z.ZodLiteral<"high">, z.ZodLiteral<"medium">, z.ZodLiteral<"low">]>;
    status: z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">]>;
}, z.core.$strip>;
/**
 * An execution plan for accomplishing complex tasks.
 *
 * Plans consist of multiple entries representing individual tasks or goals.
 * Agents report plans to clients to provide visibility into their execution strategy.
 * Plans can evolve during execution as the agent discovers new requirements or completes tasks.
 *
 * See protocol docs: [Agent Plan](https://agentclientprotocol.com/protocol/agent-plan)
 */
export declare const zPlan: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    entries: z.ZodType<{
        content: string;
        priority: "high" | "medium" | "low";
        status: "pending" | "in_progress" | "completed";
        _meta?: Record<string, unknown> | null | undefined;
    }[], {
        content: string;
        priority: "high" | "medium" | "low";
        status: "pending" | "in_progress" | "completed";
        _meta?: Record<string, unknown> | null | undefined;
    }[], z.core.$ZodTypeInternals<{
        content: string;
        priority: "high" | "medium" | "low";
        status: "pending" | "in_progress" | "completed";
        _meta?: Record<string, unknown> | null | undefined;
    }[], {
        content: string;
        priority: "high" | "medium" | "low";
        status: "pending" | "in_progress" | "completed";
        _meta?: Record<string, unknown> | null | undefined;
    }[]>>;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Unique identifier for a plan within a session.
 *
 * @experimental
 */
export declare const zPlanId: z.ZodString;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * A plan represented by a file URI.
 *
 * @experimental
 */
export declare const zPlanFile: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    id: z.ZodString;
    uri: z.ZodString;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * A plan represented as structured entries.
 *
 * @experimental
 */
export declare const zPlanItems: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    entries: z.ZodType<{
        content: string;
        priority: "high" | "medium" | "low";
        status: "pending" | "in_progress" | "completed";
        _meta?: Record<string, unknown> | null | undefined;
    }[], {
        content: string;
        priority: "high" | "medium" | "low";
        status: "pending" | "in_progress" | "completed";
        _meta?: Record<string, unknown> | null | undefined;
    }[], z.core.$ZodTypeInternals<{
        content: string;
        priority: "high" | "medium" | "low";
        status: "pending" | "in_progress" | "completed";
        _meta?: Record<string, unknown> | null | undefined;
    }[], {
        content: string;
        priority: "high" | "medium" | "low";
        status: "pending" | "in_progress" | "completed";
        _meta?: Record<string, unknown> | null | undefined;
    }[]>>;
    id: z.ZodString;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * A plan represented as raw markdown content.
 *
 * @experimental
 */
export declare const zPlanMarkdown: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodString;
    id: z.ZodString;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Removal notice for a plan identified by ID.
 *
 * @experimental
 */
export declare const zPlanRemoved: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    id: z.ZodString;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Updated content for a plan.
 *
 * @experimental
 */
export declare const zPlanUpdateContent: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    entries: z.ZodType<{
        content: string;
        priority: "high" | "medium" | "low";
        status: "pending" | "in_progress" | "completed";
        _meta?: Record<string, unknown> | null | undefined;
    }[], {
        content: string;
        priority: "high" | "medium" | "low";
        status: "pending" | "in_progress" | "completed";
        _meta?: Record<string, unknown> | null | undefined;
    }[], z.core.$ZodTypeInternals<{
        content: string;
        priority: "high" | "medium" | "low";
        status: "pending" | "in_progress" | "completed";
        _meta?: Record<string, unknown> | null | undefined;
    }[], {
        content: string;
        priority: "high" | "medium" | "low";
        status: "pending" | "in_progress" | "completed";
        _meta?: Record<string, unknown> | null | undefined;
    }[]>>;
    id: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"items">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    id: z.ZodString;
    uri: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"file">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodString;
    id: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"markdown">;
}, z.core.$strip>>]>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * A content update for a plan identified by ID.
 *
 * @experimental
 */
export declare const zPlanUpdate: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    plan: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        entries: z.ZodType<{
            content: string;
            priority: "high" | "medium" | "low";
            status: "pending" | "in_progress" | "completed";
            _meta?: Record<string, unknown> | null | undefined;
        }[], {
            content: string;
            priority: "high" | "medium" | "low";
            status: "pending" | "in_progress" | "completed";
            _meta?: Record<string, unknown> | null | undefined;
        }[], z.core.$ZodTypeInternals<{
            content: string;
            priority: "high" | "medium" | "low";
            status: "pending" | "in_progress" | "completed";
            _meta?: Record<string, unknown> | null | undefined;
        }[], {
            content: string;
            priority: "high" | "medium" | "low";
            status: "pending" | "in_progress" | "completed";
            _meta?: Record<string, unknown> | null | undefined;
        }[]>>;
        id: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"items">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        id: z.ZodString;
        uri: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"file">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"markdown">;
    }, z.core.$strip>>]>;
}, z.core.$strip>;
/**
 * A zero-based position in a text document.
 *
 * The meaning of `character` depends on the negotiated position encoding.
 */
export declare const zPosition: z.ZodObject<{
    character: z.ZodInt;
    line: z.ZodInt;
}, z.core.$strip>;
/**
 * A jump-to-location suggestion.
 */
export declare const zNesJumpSuggestion: z.ZodObject<{
    id: z.ZodString;
    position: z.ZodObject<{
        character: z.ZodInt;
        line: z.ZodInt;
    }, z.core.$strip>;
    uri: z.ZodString;
}, z.core.$strip>;
/**
 * A rename symbol suggestion.
 */
export declare const zNesRenameSuggestion: z.ZodObject<{
    id: z.ZodString;
    newName: z.ZodString;
    position: z.ZodObject<{
        character: z.ZodInt;
        line: z.ZodInt;
    }, z.core.$strip>;
    uri: z.ZodString;
}, z.core.$strip>;
/**
 * A user action (typing, cursor movement, etc.).
 */
export declare const zNesUserAction: z.ZodObject<{
    action: z.ZodString;
    position: z.ZodObject<{
        character: z.ZodInt;
        line: z.ZodInt;
    }, z.core.$strip>;
    timestampMs: z.ZodNumber;
    uri: z.ZodString;
}, z.core.$strip>;
/**
 * The encoding used for character offsets in positions.
 *
 * Follows the same conventions as LSP 3.17. The default is UTF-16.
 */
export declare const zPositionEncodingKind: z.ZodUnion<readonly [z.ZodLiteral<"utf-16">, z.ZodLiteral<"utf-32">, z.ZodLiteral<"utf-8">]>;
/**
 * Capabilities supported by the client.
 *
 * Advertised during initialization to inform the agent about
 * available features and methods.
 *
 * See protocol docs: [Client Capabilities](https://agentclientprotocol.com/protocol/initialization#client-capabilities)
 */
export declare const zClientCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    auth: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        terminal: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>>>;
    elicitation: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        form: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$strip>>>>;
        url: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$strip>>>>;
    }, z.core.$strip>>>>;
    fs: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        readTextFile: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        writeTextFile: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>>>;
    nes: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        jump: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$strip>>>>;
        rename: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$strip>>>>;
        searchAndReplace: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$strip>>>>;
    }, z.core.$strip>>>>;
    plan: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>>>;
    positionEncodings: z.ZodCatch<z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodUnion<readonly [z.ZodLiteral<"utf-16">, z.ZodLiteral<"utf-32">, z.ZodLiteral<"utf-8">]>>>, z.ZodTransform<("utf-16" | "utf-32" | "utf-8")[], ("utf-16" | "utf-32" | "utf-8")[]>>>>;
    terminal: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
/**
 * Prompt capabilities supported by the agent in `session/prompt` requests.
 *
 * Baseline agent functionality requires support for [`ContentBlock::Text`]
 * and [`ContentBlock::ResourceLink`] in prompt requests.
 *
 * Other variants must be explicitly opted in to.
 * Capabilities for different types of content in prompt requests.
 *
 * Indicates which content types beyond the baseline (text and resource links)
 * the agent can process.
 *
 * See protocol docs: [Prompt Capabilities](https://agentclientprotocol.com/protocol/initialization#prompt-capabilities)
 */
export declare const zPromptCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    audio: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    embeddedContext: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    image: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
/**
 * Protocol version identifier.
 *
 * This version is only bumped for breaking changes.
 * Non-breaking changes should be introduced via capabilities.
 */
export declare const zProtocolVersion: z.ZodInt;
/**
 * Request parameters for the initialize method.
 *
 * Sent by the client to establish connection and negotiate capabilities.
 *
 * See protocol docs: [Initialization](https://agentclientprotocol.com/protocol/initialization)
 */
export declare const zInitializeRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    clientCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        auth: z.ZodDefault<z.ZodOptional<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            terminal: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, z.core.$strip>>>;
        elicitation: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            form: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$strip>>>>;
            url: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$strip>>>>;
        }, z.core.$strip>>>>;
        fs: z.ZodDefault<z.ZodOptional<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            readTextFile: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            writeTextFile: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, z.core.$strip>>>;
        nes: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            jump: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$strip>>>>;
            rename: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$strip>>>>;
            searchAndReplace: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$strip>>>>;
        }, z.core.$strip>>>>;
        plan: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$strip>>>>;
        positionEncodings: z.ZodCatch<z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodUnion<readonly [z.ZodLiteral<"utf-16">, z.ZodLiteral<"utf-32">, z.ZodLiteral<"utf-8">]>>>, z.ZodTransform<("utf-16" | "utf-32" | "utf-8")[], ("utf-16" | "utf-32" | "utf-8")[]>>>>;
        terminal: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>>>;
    clientInfo: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        name: z.ZodString;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        version: z.ZodString;
    }, z.core.$strip>>>>;
    protocolVersion: z.ZodInt;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Current effective non-secret routing configuration for a provider.
 *
 * @experimental
 */
export declare const zProviderCurrentConfig: z.ZodObject<{
    apiType: z.ZodUnion<readonly [z.ZodLiteral<"anthropic">, z.ZodLiteral<"openai">, z.ZodLiteral<"azure">, z.ZodLiteral<"vertex">, z.ZodLiteral<"bedrock">, z.ZodString]>;
    baseUrl: z.ZodString;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Information about a configurable LLM provider.
 *
 * @experimental
 */
export declare const zProviderInfo: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    current: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        apiType: z.ZodUnion<readonly [z.ZodLiteral<"anthropic">, z.ZodLiteral<"openai">, z.ZodLiteral<"azure">, z.ZodLiteral<"vertex">, z.ZodLiteral<"bedrock">, z.ZodString]>;
        baseUrl: z.ZodString;
    }, z.core.$strip>>>;
    id: z.ZodString;
    required: z.ZodBoolean;
    supported: z.ZodType<string[], string[], z.core.$ZodTypeInternals<string[], string[]>>;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Response to `providers/list`.
 *
 * @experimental
 */
export declare const zListProvidersResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    providers: z.ZodType<{
        id: string;
        required: boolean;
        supported: string[];
        _meta?: Record<string, unknown> | null | undefined;
        current?: {
            apiType: string;
            baseUrl: string;
        } | null | undefined;
    }[], {
        id: string;
        required: boolean;
        supported: string[];
        _meta?: Record<string, unknown> | null | undefined;
        current?: {
            apiType: string;
            baseUrl: string;
        } | null | undefined;
    }[], z.core.$ZodTypeInternals<{
        id: string;
        required: boolean;
        supported: string[];
        _meta?: Record<string, unknown> | null | undefined;
        current?: {
            apiType: string;
            baseUrl: string;
        } | null | undefined;
    }[], {
        id: string;
        required: boolean;
        supported: string[];
        _meta?: Record<string, unknown> | null | undefined;
        current?: {
            apiType: string;
            baseUrl: string;
        } | null | undefined;
    }[]>>;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Provider configuration capabilities supported by the agent.
 *
 * By supplying `{}` it means that the agent supports provider configuration methods.
 *
 * @experimental
 */
export declare const zProvidersCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * A range in a text document, expressed as start and end positions.
 */
export declare const zRange: z.ZodObject<{
    end: z.ZodObject<{
        character: z.ZodInt;
        line: z.ZodInt;
    }, z.core.$strip>;
    start: z.ZodObject<{
        character: z.ZodInt;
        line: z.ZodInt;
    }, z.core.$strip>;
}, z.core.$strip>;
/**
 * A diagnostic (error, warning, etc.).
 */
export declare const zNesDiagnostic: z.ZodObject<{
    message: z.ZodString;
    range: z.ZodObject<{
        end: z.ZodObject<{
            character: z.ZodInt;
            line: z.ZodInt;
        }, z.core.$strip>;
        start: z.ZodObject<{
            character: z.ZodInt;
            line: z.ZodInt;
        }, z.core.$strip>;
    }, z.core.$strip>;
    severity: z.ZodUnion<readonly [z.ZodLiteral<"error">, z.ZodLiteral<"warning">, z.ZodLiteral<"information">, z.ZodLiteral<"hint">]>;
    uri: z.ZodString;
}, z.core.$strip>;
/**
 * An open file in the editor.
 */
export declare const zNesOpenFile: z.ZodObject<{
    languageId: z.ZodString;
    lastFocusedMs: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    uri: z.ZodString;
    visibleRange: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        end: z.ZodObject<{
            character: z.ZodInt;
            line: z.ZodInt;
        }, z.core.$strip>;
        start: z.ZodObject<{
            character: z.ZodInt;
            line: z.ZodInt;
        }, z.core.$strip>;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
/**
 * Context attached to a suggestion request.
 */
export declare const zNesSuggestContext: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    diagnostics: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
        message: z.ZodString;
        range: z.ZodObject<{
            end: z.ZodObject<{
                character: z.ZodInt;
                line: z.ZodInt;
            }, z.core.$strip>;
            start: z.ZodObject<{
                character: z.ZodInt;
                line: z.ZodInt;
            }, z.core.$strip>;
        }, z.core.$strip>;
        severity: z.ZodUnion<readonly [z.ZodLiteral<"error">, z.ZodLiteral<"warning">, z.ZodLiteral<"information">, z.ZodLiteral<"hint">]>;
        uri: z.ZodString;
    }, z.core.$strip>>>, z.ZodTransform<{
        message: string;
        range: {
            end: {
                character: number;
                line: number;
            };
            start: {
                character: number;
                line: number;
            };
        };
        severity: "error" | "warning" | "information" | "hint";
        uri: string;
    }[], {
        message: string;
        range: {
            end: {
                character: number;
                line: number;
            };
            start: {
                character: number;
                line: number;
            };
        };
        severity: "error" | "warning" | "information" | "hint";
        uri: string;
    }[]>>>>>;
    editHistory: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
        diff: z.ZodString;
        uri: z.ZodString;
    }, z.core.$strip>>>, z.ZodTransform<{
        diff: string;
        uri: string;
    }[], {
        diff: string;
        uri: string;
    }[]>>>>>;
    openFiles: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
        languageId: z.ZodString;
        lastFocusedMs: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
        uri: z.ZodString;
        visibleRange: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            end: z.ZodObject<{
                character: z.ZodInt;
                line: z.ZodInt;
            }, z.core.$strip>;
            start: z.ZodObject<{
                character: z.ZodInt;
                line: z.ZodInt;
            }, z.core.$strip>;
        }, z.core.$strip>>>>;
    }, z.core.$strip>>>, z.ZodTransform<{
        languageId: string;
        uri: string;
        lastFocusedMs?: number | null | undefined;
        visibleRange?: {
            end: {
                character: number;
                line: number;
            };
            start: {
                character: number;
                line: number;
            };
        } | null | undefined;
    }[], {
        languageId: string;
        uri: string;
        lastFocusedMs?: number | null | undefined;
        visibleRange?: {
            end: {
                character: number;
                line: number;
            };
            start: {
                character: number;
                line: number;
            };
        } | null | undefined;
    }[]>>>>>;
    recentFiles: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
        languageId: z.ZodString;
        text: z.ZodString;
        uri: z.ZodString;
    }, z.core.$strip>>>, z.ZodTransform<{
        languageId: string;
        text: string;
        uri: string;
    }[], {
        languageId: string;
        text: string;
        uri: string;
    }[]>>>>>;
    relatedSnippets: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
        excerpts: z.ZodArray<z.ZodObject<{
            endLine: z.ZodInt;
            startLine: z.ZodInt;
            text: z.ZodString;
        }, z.core.$strip>>;
        uri: z.ZodString;
    }, z.core.$strip>>>, z.ZodTransform<{
        excerpts: {
            endLine: number;
            startLine: number;
            text: string;
        }[];
        uri: string;
    }[], {
        excerpts: {
            endLine: number;
            startLine: number;
            text: string;
        }[];
        uri: string;
    }[]>>>>>;
    userActions: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
        action: z.ZodString;
        position: z.ZodObject<{
            character: z.ZodInt;
            line: z.ZodInt;
        }, z.core.$strip>;
        timestampMs: z.ZodNumber;
        uri: z.ZodString;
    }, z.core.$strip>>>, z.ZodTransform<{
        action: string;
        position: {
            character: number;
            line: number;
        };
        timestampMs: number;
        uri: string;
    }[], {
        action: string;
        position: {
            character: number;
            line: number;
        };
        timestampMs: number;
        uri: string;
    }[]>>>>>;
}, z.core.$strip>;
/**
 * A text edit within a suggestion.
 */
export declare const zNesTextEdit: z.ZodObject<{
    newText: z.ZodString;
    range: z.ZodObject<{
        end: z.ZodObject<{
            character: z.ZodInt;
            line: z.ZodInt;
        }, z.core.$strip>;
        start: z.ZodObject<{
            character: z.ZodInt;
            line: z.ZodInt;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
/**
 * A text edit suggestion.
 */
export declare const zNesEditSuggestion: z.ZodObject<{
    cursorPosition: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        character: z.ZodInt;
        line: z.ZodInt;
    }, z.core.$strip>>>>;
    edits: z.ZodArray<z.ZodObject<{
        newText: z.ZodString;
        range: z.ZodObject<{
            end: z.ZodObject<{
                character: z.ZodInt;
                line: z.ZodInt;
            }, z.core.$strip>;
            start: z.ZodObject<{
                character: z.ZodInt;
                line: z.ZodInt;
            }, z.core.$strip>;
        }, z.core.$strip>;
    }, z.core.$strip>>;
    id: z.ZodString;
    uri: z.ZodString;
}, z.core.$strip>;
/**
 * A suggestion returned by the agent.
 */
export declare const zNesSuggestion: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
    cursorPosition: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        character: z.ZodInt;
        line: z.ZodInt;
    }, z.core.$strip>>>>;
    edits: z.ZodArray<z.ZodObject<{
        newText: z.ZodString;
        range: z.ZodObject<{
            end: z.ZodObject<{
                character: z.ZodInt;
                line: z.ZodInt;
            }, z.core.$strip>;
            start: z.ZodObject<{
                character: z.ZodInt;
                line: z.ZodInt;
            }, z.core.$strip>;
        }, z.core.$strip>;
    }, z.core.$strip>>;
    id: z.ZodString;
    uri: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"edit">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    id: z.ZodString;
    position: z.ZodObject<{
        character: z.ZodInt;
        line: z.ZodInt;
    }, z.core.$strip>;
    uri: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"jump">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    id: z.ZodString;
    newName: z.ZodString;
    position: z.ZodObject<{
        character: z.ZodInt;
        line: z.ZodInt;
    }, z.core.$strip>;
    uri: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"rename">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    id: z.ZodString;
    isRegex: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    replace: z.ZodString;
    search: z.ZodString;
    uri: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"searchAndReplace">;
}, z.core.$strip>>]>;
/**
 * Response containing the contents of a text file.
 */
export declare const zReadTextFileResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodString;
}, z.core.$strip>;
/**
 * Response to terminal/release method
 */
export declare const zReleaseTerminalResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * JSON RPC Request Id
 *
 * An identifier established by the Client that MUST contain a String, Number, or NULL value if included. If it is not included it is assumed to be a notification. The value SHOULD normally not be Null \[1\] and Numbers SHOULD NOT contain fractional parts \[2\]
 *
 * The Server MUST reply with the same value in the Response object if included. This member is used to correlate the context between the two objects.
 *
 * \[1\] The use of Null as a value for the id member in a Request object is discouraged, because this specification uses a value of Null for Responses with an unknown id. Also, because JSON-RPC 1.0 uses an id value of Null for Notifications this could cause confusion in handling.
 *
 * \[2\] Fractional parts may be problematic, since many decimal fractions cannot be represented exactly as binary fractions.
 */
export declare const zRequestId: z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Notification to cancel an ongoing request.
 *
 * See protocol docs: [Cancellation](https://agentclientprotocol.com/protocol/cancellation)
 *
 * @experimental
 */
export declare const zCancelRequestNotification: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    requestId: z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Request-scoped elicitation, tied to a specific JSON-RPC request outside of a session
 * (e.g., during auth/configuration phases before any session is started).
 *
 * @experimental
 */
export declare const zElicitationRequestScope: z.ZodObject<{
    requestId: z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
}, z.core.$strip>;
/**
 * The sender or recipient of messages and data in a conversation.
 */
export declare const zRole: z.ZodEnum<{
    assistant: "assistant";
    user: "user";
}>;
/**
 * Optional annotations for the client. The client can use annotations to inform how objects are used or displayed
 */
export declare const zAnnotations: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
        assistant: "assistant";
        user: "user";
    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strip>;
/**
 * Audio provided to or from an LLM.
 */
export declare const zAudioContent: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
            assistant: "assistant";
            user: "user";
        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>>>;
    data: z.ZodString;
    mimeType: z.ZodString;
}, z.core.$strip>;
/**
 * An image provided to or from an LLM.
 */
export declare const zImageContent: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
            assistant: "assistant";
            user: "user";
        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>>>;
    data: z.ZodString;
    mimeType: z.ZodString;
    uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/**
 * A resource that the server is capable of reading, included in a prompt or tool call result.
 */
export declare const zResourceLink: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
            assistant: "assistant";
            user: "user";
        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodString;
    size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    uri: z.ZodString;
}, z.core.$strip>;
/**
 * The user selected one of the provided options.
 */
export declare const zSelectedPermissionOutcome: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    optionId: z.ZodString;
}, z.core.$strip>;
/**
 * The outcome of a permission request.
 */
export declare const zRequestPermissionOutcome: z.ZodUnion<readonly [z.ZodObject<{
    outcome: z.ZodLiteral<"cancelled">;
}, z.core.$strip>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    optionId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    outcome: z.ZodLiteral<"selected">;
}, z.core.$strip>>]>;
/**
 * Response to a permission request.
 */
export declare const zRequestPermissionResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    outcome: z.ZodUnion<readonly [z.ZodObject<{
        outcome: z.ZodLiteral<"cancelled">;
    }, z.core.$strip>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        optionId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        outcome: z.ZodLiteral<"selected">;
    }, z.core.$strip>>]>;
}, z.core.$strip>;
/**
 * Capabilities for additional session directories support.
 *
 * By supplying `{}` it means that the agent supports the `additionalDirectories`
 * field on supported session lifecycle requests. Agents that also support
 * `session/list` may return `SessionInfo.additionalDirectories` to report the
 * complete ordered additional-root list associated with a listed session.
 */
export declare const zSessionAdditionalDirectoriesCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * Capabilities for the `session/close` method.
 *
 * By supplying `{}` it means that the agent supports closing of sessions.
 */
export declare const zSessionCloseCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * A boolean on/off toggle session configuration option payload.
 *
 * @experimental
 */
export declare const zSessionConfigBoolean: z.ZodObject<{
    currentValue: z.ZodBoolean;
}, z.core.$strip>;
/**
 * Unique identifier for a session configuration option value group.
 */
export declare const zSessionConfigGroupId: z.ZodString;
/**
 * Unique identifier for a session configuration option.
 */
export declare const zSessionConfigId: z.ZodString;
/**
 * Semantic category for a session configuration option.
 *
 * This is intended to help Clients distinguish broadly common selectors (e.g. model selector vs
 * session mode selector vs thought/reasoning level) for UX purposes (keyboard shortcuts, icons,
 * placement). It MUST NOT be required for correctness. Clients MUST handle missing or unknown
 * categories gracefully.
 *
 * Category names beginning with `_` are free for custom use, like other ACP extension methods.
 * Category names that do not begin with `_` are reserved for the ACP spec.
 */
export declare const zSessionConfigOptionCategory: z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>;
/**
 * Unique identifier for a session configuration option value.
 */
export declare const zSessionConfigValueId: z.ZodString;
/**
 * A possible value for a session configuration option.
 */
export declare const zSessionConfigSelectOption: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodString;
    value: z.ZodString;
}, z.core.$strip>;
/**
 * A group of possible values for a session configuration option.
 */
export declare const zSessionConfigSelectGroup: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    group: z.ZodString;
    name: z.ZodString;
    options: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Possible values for a session configuration option.
 */
export declare const zSessionConfigSelectOptions: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodString;
    value: z.ZodString;
}, z.core.$strip>>, z.ZodArray<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    group: z.ZodString;
    name: z.ZodString;
    options: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>>]>;
/**
 * A single-value selector (dropdown) session configuration option payload.
 */
export declare const zSessionConfigSelect: z.ZodObject<{
    currentValue: z.ZodString;
    options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$strip>>, z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        group: z.ZodString;
        name: z.ZodString;
        options: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>>]>;
}, z.core.$strip>;
/**
 * A session configuration option selector and its current state.
 */
export declare const zSessionConfigOption: z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
    currentValue: z.ZodString;
    options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$strip>>, z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        group: z.ZodString;
        name: z.ZodString;
        options: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>>]>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"select">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    currentValue: z.ZodBoolean;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"boolean">;
}, z.core.$strip>>]>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    category: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    id: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>>;
/**
 * Session configuration options have been updated.
 */
export declare const zConfigOptionUpdate: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    configOptions: z.ZodType<((({
        currentValue: string;
        options: {
            name: string;
            value: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[] | {
            group: string;
            name: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[];
            _meta?: Record<string, unknown> | null | undefined;
        }[];
    } & {
        type: "select";
    }) | ({
        currentValue: boolean;
    } & {
        type: "boolean";
    })) & {
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        category?: string | null | undefined;
        description?: string | null | undefined;
    })[], ((({
        currentValue: string;
        options: {
            name: string;
            value: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[] | {
            group: string;
            name: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[];
            _meta?: Record<string, unknown> | null | undefined;
        }[];
    } & {
        type: "select";
    }) | ({
        currentValue: boolean;
    } & {
        type: "boolean";
    })) & {
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        category?: string | null | undefined;
        description?: string | null | undefined;
    })[], z.core.$ZodTypeInternals<((({
        currentValue: string;
        options: {
            name: string;
            value: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[] | {
            group: string;
            name: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[];
            _meta?: Record<string, unknown> | null | undefined;
        }[];
    } & {
        type: "select";
    }) | ({
        currentValue: boolean;
    } & {
        type: "boolean";
    })) & {
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        category?: string | null | undefined;
        description?: string | null | undefined;
    })[], ((({
        currentValue: string;
        options: {
            name: string;
            value: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[] | {
            group: string;
            name: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[];
            _meta?: Record<string, unknown> | null | undefined;
        }[];
    } & {
        type: "select";
    }) | ({
        currentValue: boolean;
    } & {
        type: "boolean";
    })) & {
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        category?: string | null | undefined;
        description?: string | null | undefined;
    })[]>>;
}, z.core.$strip>;
/**
 * Capabilities for the `session/delete` method.
 *
 * Supplying `{}` means the agent supports deleting sessions from `session/list`.
 */
export declare const zSessionDeleteCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Capabilities for the `session/fork` method.
 *
 * By supplying `{}` it means that the agent supports forking of sessions.
 *
 * @experimental
 */
export declare const zSessionForkCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * A unique identifier for a conversation session between a client and agent.
 *
 * Sessions maintain their own context, conversation history, and state,
 * allowing multiple independent interactions with the same agent.
 *
 * See protocol docs: [Session ID](https://agentclientprotocol.com/protocol/session-setup#session-id)
 */
export declare const zSessionId: z.ZodString;
/**
 * Notification sent when a suggestion is accepted.
 */
export declare const zAcceptNesNotification: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    id: z.ZodString;
    sessionId: z.ZodString;
}, z.core.$strip>;
/**
 * Notification to cancel ongoing operations for a session.
 *
 * See protocol docs: [Cancellation](https://agentclientprotocol.com/protocol/prompt-turn#cancellation)
 */
export declare const zCancelNotification: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    sessionId: z.ZodString;
}, z.core.$strip>;
/**
 * Request to close an NES session.
 *
 * The agent **must** cancel any ongoing work related to the NES session
 * and then free up any resources associated with the session.
 */
export declare const zCloseNesRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    sessionId: z.ZodString;
}, z.core.$strip>;
/**
 * Request parameters for closing an active session.
 *
 * If supported, the agent **must** cancel any ongoing work related to the session
 * (treat it as if `session/cancel` was called) and then free up any resources
 * associated with the session.
 *
 * Only available if the Agent supports the `sessionCapabilities.close` capability.
 */
export declare const zCloseSessionRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    sessionId: z.ZodString;
}, z.core.$strip>;
/**
 * Request to create a new terminal and execute a command.
 */
export declare const zCreateTerminalRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    args: z.ZodOptional<z.ZodArray<z.ZodString>>;
    command: z.ZodString;
    cwd: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    env: z.ZodOptional<z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        name: z.ZodString;
        value: z.ZodString;
    }, z.core.$strip>>>;
    outputByteLimit: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    sessionId: z.ZodString;
}, z.core.$strip>;
/**
 * Request parameters for deleting an existing session from `session/list`.
 *
 * Only available if the Agent supports the `sessionCapabilities.delete` capability.
 */
export declare const zDeleteSessionRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    sessionId: z.ZodString;
}, z.core.$strip>;
/**
 * Notification sent when a file is closed.
 */
export declare const zDidCloseDocumentNotification: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    sessionId: z.ZodString;
    uri: z.ZodString;
}, z.core.$strip>;
/**
 * Notification sent when a file becomes the active editor tab.
 */
export declare const zDidFocusDocumentNotification: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    position: z.ZodObject<{
        character: z.ZodInt;
        line: z.ZodInt;
    }, z.core.$strip>;
    sessionId: z.ZodString;
    uri: z.ZodString;
    version: z.ZodNumber;
    visibleRange: z.ZodObject<{
        end: z.ZodObject<{
            character: z.ZodInt;
            line: z.ZodInt;
        }, z.core.$strip>;
        start: z.ZodObject<{
            character: z.ZodInt;
            line: z.ZodInt;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
/**
 * Notification sent when a file is opened in the editor.
 */
export declare const zDidOpenDocumentNotification: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    languageId: z.ZodString;
    sessionId: z.ZodString;
    text: z.ZodString;
    uri: z.ZodString;
    version: z.ZodNumber;
}, z.core.$strip>;
/**
 * Notification sent when a file is saved.
 */
export declare const zDidSaveDocumentNotification: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    sessionId: z.ZodString;
    uri: z.ZodString;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Request parameters for forking an existing session.
 *
 * Creates a new session based on the context of an existing one, allowing
 * operations like generating summaries without affecting the original session's history.
 *
 * Only available if the Agent supports the `session.fork` capability.
 *
 * @experimental
 */
export declare const zForkSessionRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    additionalDirectories: z.ZodOptional<z.ZodArray<z.ZodString>>;
    cwd: z.ZodString;
    mcpServers: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        headers: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>;
        name: z.ZodString;
        url: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"http">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        headers: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>;
        name: z.ZodString;
        url: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"sse">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"acp">;
    }, z.core.$strip>>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        args: z.ZodArray<z.ZodString>;
        command: z.ZodString;
        env: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>;
        name: z.ZodString;
    }, z.core.$strip>]>>>;
    sessionId: z.ZodString;
}, z.core.$strip>;
/**
 * Request to kill a terminal without releasing it.
 */
export declare const zKillTerminalRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    sessionId: z.ZodString;
    terminalId: z.ZodString;
}, z.core.$strip>;
/**
 * Request parameters for loading an existing session.
 *
 * Only available if the Agent supports the `loadSession` capability.
 *
 * See protocol docs: [Loading Sessions](https://agentclientprotocol.com/protocol/session-setup#loading-sessions)
 */
export declare const zLoadSessionRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    additionalDirectories: z.ZodOptional<z.ZodArray<z.ZodString>>;
    cwd: z.ZodString;
    mcpServers: z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        headers: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>;
        name: z.ZodString;
        url: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"http">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        headers: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>;
        name: z.ZodString;
        url: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"sse">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"acp">;
    }, z.core.$strip>>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        args: z.ZodArray<z.ZodString>;
        command: z.ZodString;
        env: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>;
        name: z.ZodString;
    }, z.core.$strip>]>>;
    sessionId: z.ZodString;
}, z.core.$strip>;
/**
 * Request to read content from a text file.
 *
 * Only available if the client supports the `fs.readTextFile` capability.
 */
export declare const zReadTextFileRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    limit: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
    line: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
    path: z.ZodString;
    sessionId: z.ZodString;
}, z.core.$strip>;
/**
 * Notification sent when a suggestion is rejected.
 */
export declare const zRejectNesNotification: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    id: z.ZodString;
    reason: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"rejected">, z.ZodLiteral<"ignored">, z.ZodLiteral<"replaced">, z.ZodLiteral<"cancelled">]>>>>;
    sessionId: z.ZodString;
}, z.core.$strip>;
/**
 * Request to release a terminal and free its resources.
 */
export declare const zReleaseTerminalRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    sessionId: z.ZodString;
    terminalId: z.ZodString;
}, z.core.$strip>;
/**
 * Request parameters for resuming an existing session.
 *
 * Resumes an existing session without returning previous messages (unlike `session/load`).
 * This is useful for agents that can resume sessions but don't implement full session loading.
 *
 * Only available if the Agent supports the `sessionCapabilities.resume` capability.
 */
export declare const zResumeSessionRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    additionalDirectories: z.ZodOptional<z.ZodArray<z.ZodString>>;
    cwd: z.ZodString;
    mcpServers: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        headers: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>;
        name: z.ZodString;
        url: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"http">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        headers: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>;
        name: z.ZodString;
        url: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"sse">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"acp">;
    }, z.core.$strip>>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        args: z.ZodArray<z.ZodString>;
        command: z.ZodString;
        env: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>;
        name: z.ZodString;
    }, z.core.$strip>]>>>;
    sessionId: z.ZodString;
}, z.core.$strip>;
/**
 * Information about a session returned by session/list
 */
export declare const zSessionInfo: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    additionalDirectories: z.ZodOptional<z.ZodArray<z.ZodString>>;
    cwd: z.ZodString;
    sessionId: z.ZodString;
    title: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    updatedAt: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
}, z.core.$strip>;
/**
 * Response from listing sessions.
 */
export declare const zListSessionsResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    nextCursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sessions: z.ZodType<{
        cwd: string;
        sessionId: string;
        _meta?: Record<string, unknown> | null | undefined;
        additionalDirectories?: string[] | undefined;
        title?: string | null | undefined;
        updatedAt?: string | null | undefined;
    }[], {
        cwd: string;
        sessionId: string;
        _meta?: Record<string, unknown> | null | undefined;
        additionalDirectories?: string[] | undefined;
        title?: string | null | undefined;
        updatedAt?: string | null | undefined;
    }[], z.core.$ZodTypeInternals<{
        cwd: string;
        sessionId: string;
        _meta?: Record<string, unknown> | null | undefined;
        additionalDirectories?: string[] | undefined;
        title?: string | null | undefined;
        updatedAt?: string | null | undefined;
    }[], {
        cwd: string;
        sessionId: string;
        _meta?: Record<string, unknown> | null | undefined;
        additionalDirectories?: string[] | undefined;
        title?: string | null | undefined;
        updatedAt?: string | null | undefined;
    }[]>>;
}, z.core.$strip>;
/**
 * Update to session metadata. All fields are optional to support partial updates.
 *
 * Agents send this notification to update session information like title or custom metadata.
 * This allows clients to display dynamic session names and track session state changes.
 */
export declare const zSessionInfoUpdate: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/**
 * Capabilities for the `session/list` method.
 *
 * By supplying `{}` it means that the agent supports listing of sessions.
 */
export declare const zSessionListCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * Unique identifier for a Session Mode.
 */
export declare const zSessionModeId: z.ZodString;
/**
 * The current mode of the session has changed
 *
 * See protocol docs: [Session Modes](https://agentclientprotocol.com/protocol/session-modes)
 */
export declare const zCurrentModeUpdate: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    currentModeId: z.ZodString;
}, z.core.$strip>;
/**
 * A mode the agent can operate in.
 *
 * See protocol docs: [Session Modes](https://agentclientprotocol.com/protocol/session-modes)
 */
export declare const zSessionMode: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    id: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
/**
 * The set of modes and the one currently active.
 */
export declare const zSessionModeState: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    availableModes: z.ZodType<{
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        description?: string | null | undefined;
    }[], {
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        description?: string | null | undefined;
    }[], z.core.$ZodTypeInternals<{
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        description?: string | null | undefined;
    }[], {
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        description?: string | null | undefined;
    }[]>>;
    currentModeId: z.ZodString;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Response from forking an existing session.
 *
 * @experimental
 */
export declare const zForkSessionResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    configOptions: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        currentValue: z.ZodString;
        options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>, z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            group: z.ZodString;
            name: z.ZodString;
            options: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>>]>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"select">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        currentValue: z.ZodBoolean;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"boolean">;
    }, z.core.$strip>>]>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        category: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$strip>>>>, z.ZodTransform<((({
        currentValue: string;
        options: {
            name: string;
            value: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[] | {
            group: string;
            name: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[];
            _meta?: Record<string, unknown> | null | undefined;
        }[];
    } & {
        type: "select";
    }) | ({
        currentValue: boolean;
    } & {
        type: "boolean";
    })) & {
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        category?: string | null | undefined;
        description?: string | null | undefined;
    })[], ((({
        currentValue: string;
        options: {
            name: string;
            value: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[] | {
            group: string;
            name: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[];
            _meta?: Record<string, unknown> | null | undefined;
        }[];
    } & {
        type: "select";
    }) | ({
        currentValue: boolean;
    } & {
        type: "boolean";
    })) & {
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        category?: string | null | undefined;
        description?: string | null | undefined;
    })[]>>>>>;
    modes: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        availableModes: z.ZodType<{
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[], {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[], z.core.$ZodTypeInternals<{
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[], {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[]>>;
        currentModeId: z.ZodString;
    }, z.core.$strip>>>>;
    sessionId: z.ZodString;
}, z.core.$strip>;
/**
 * Response from loading an existing session.
 */
export declare const zLoadSessionResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    configOptions: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        currentValue: z.ZodString;
        options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>, z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            group: z.ZodString;
            name: z.ZodString;
            options: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>>]>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"select">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        currentValue: z.ZodBoolean;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"boolean">;
    }, z.core.$strip>>]>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        category: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$strip>>>>, z.ZodTransform<((({
        currentValue: string;
        options: {
            name: string;
            value: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[] | {
            group: string;
            name: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[];
            _meta?: Record<string, unknown> | null | undefined;
        }[];
    } & {
        type: "select";
    }) | ({
        currentValue: boolean;
    } & {
        type: "boolean";
    })) & {
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        category?: string | null | undefined;
        description?: string | null | undefined;
    })[], ((({
        currentValue: string;
        options: {
            name: string;
            value: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[] | {
            group: string;
            name: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[];
            _meta?: Record<string, unknown> | null | undefined;
        }[];
    } & {
        type: "select";
    }) | ({
        currentValue: boolean;
    } & {
        type: "boolean";
    })) & {
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        category?: string | null | undefined;
        description?: string | null | undefined;
    })[]>>>>>;
    modes: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        availableModes: z.ZodType<{
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[], {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[], z.core.$ZodTypeInternals<{
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[], {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[]>>;
        currentModeId: z.ZodString;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
/**
 * Response from creating a new session.
 *
 * See protocol docs: [Creating a Session](https://agentclientprotocol.com/protocol/session-setup#creating-a-session)
 */
export declare const zNewSessionResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    configOptions: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        currentValue: z.ZodString;
        options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>, z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            group: z.ZodString;
            name: z.ZodString;
            options: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>>]>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"select">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        currentValue: z.ZodBoolean;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"boolean">;
    }, z.core.$strip>>]>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        category: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$strip>>>>, z.ZodTransform<((({
        currentValue: string;
        options: {
            name: string;
            value: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[] | {
            group: string;
            name: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[];
            _meta?: Record<string, unknown> | null | undefined;
        }[];
    } & {
        type: "select";
    }) | ({
        currentValue: boolean;
    } & {
        type: "boolean";
    })) & {
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        category?: string | null | undefined;
        description?: string | null | undefined;
    })[], ((({
        currentValue: string;
        options: {
            name: string;
            value: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[] | {
            group: string;
            name: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[];
            _meta?: Record<string, unknown> | null | undefined;
        }[];
    } & {
        type: "select";
    }) | ({
        currentValue: boolean;
    } & {
        type: "boolean";
    })) & {
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        category?: string | null | undefined;
        description?: string | null | undefined;
    })[]>>>>>;
    modes: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        availableModes: z.ZodType<{
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[], {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[], z.core.$ZodTypeInternals<{
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[], {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[]>>;
        currentModeId: z.ZodString;
    }, z.core.$strip>>>>;
    sessionId: z.ZodString;
}, z.core.$strip>;
/**
 * Response from resuming an existing session.
 */
export declare const zResumeSessionResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    configOptions: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        currentValue: z.ZodString;
        options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>, z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            group: z.ZodString;
            name: z.ZodString;
            options: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>>]>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"select">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        currentValue: z.ZodBoolean;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"boolean">;
    }, z.core.$strip>>]>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        category: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$strip>>>>, z.ZodTransform<((({
        currentValue: string;
        options: {
            name: string;
            value: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[] | {
            group: string;
            name: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[];
            _meta?: Record<string, unknown> | null | undefined;
        }[];
    } & {
        type: "select";
    }) | ({
        currentValue: boolean;
    } & {
        type: "boolean";
    })) & {
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        category?: string | null | undefined;
        description?: string | null | undefined;
    })[], ((({
        currentValue: string;
        options: {
            name: string;
            value: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[] | {
            group: string;
            name: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[];
            _meta?: Record<string, unknown> | null | undefined;
        }[];
    } & {
        type: "select";
    }) | ({
        currentValue: boolean;
    } & {
        type: "boolean";
    })) & {
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        category?: string | null | undefined;
        description?: string | null | undefined;
    })[]>>>>>;
    modes: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        availableModes: z.ZodType<{
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[], {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[], z.core.$ZodTypeInternals<{
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[], {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[]>>;
        currentModeId: z.ZodString;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
/**
 * Capabilities for the `session/resume` method.
 *
 * By supplying `{}` it means that the agent supports resuming of sessions.
 */
export declare const zSessionResumeCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * Session capabilities supported by the agent.
 *
 * As a baseline, all Agents **MUST** support `session/new`, `session/prompt`, `session/cancel`, and `session/update`.
 *
 * Optionally, they **MAY** support other session methods and notifications by specifying additional capabilities.
 *
 * Note: `session/load` is still handled by the top-level `load_session` capability. This will be unified in future versions of the protocol.
 *
 * See protocol docs: [Session Capabilities](https://agentclientprotocol.com/protocol/initialization#session-capabilities)
 */
export declare const zSessionCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    additionalDirectories: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>>>;
    close: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>>>;
    delete: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>>>;
    fork: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>>>;
    list: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>>>;
    resume: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Request parameters for `providers/set`.
 *
 * Replaces the full configuration for one provider id.
 *
 * @experimental
 */
export declare const zSetProviderRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    apiType: z.ZodUnion<readonly [z.ZodLiteral<"anthropic">, z.ZodLiteral<"openai">, z.ZodLiteral<"azure">, z.ZodLiteral<"vertex">, z.ZodLiteral<"bedrock">, z.ZodString]>;
    baseUrl: z.ZodString;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    id: z.ZodString;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Response to `providers/set`.
 *
 * @experimental
 */
export declare const zSetProviderResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * Request parameters for setting a session configuration option.
 */
export declare const zSetSessionConfigOptionRequest: z.ZodIntersection<z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodLiteral<"boolean">;
    value: z.ZodBoolean;
}, z.core.$strip>, z.ZodObject<{
    value: z.ZodString;
}, z.core.$strip>]>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    configId: z.ZodString;
    sessionId: z.ZodString;
}, z.core.$strip>>;
/**
 * Response to `session/set_config_option` method.
 */
export declare const zSetSessionConfigOptionResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    configOptions: z.ZodType<((({
        currentValue: string;
        options: {
            name: string;
            value: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[] | {
            group: string;
            name: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[];
            _meta?: Record<string, unknown> | null | undefined;
        }[];
    } & {
        type: "select";
    }) | ({
        currentValue: boolean;
    } & {
        type: "boolean";
    })) & {
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        category?: string | null | undefined;
        description?: string | null | undefined;
    })[], ((({
        currentValue: string;
        options: {
            name: string;
            value: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[] | {
            group: string;
            name: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[];
            _meta?: Record<string, unknown> | null | undefined;
        }[];
    } & {
        type: "select";
    }) | ({
        currentValue: boolean;
    } & {
        type: "boolean";
    })) & {
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        category?: string | null | undefined;
        description?: string | null | undefined;
    })[], z.core.$ZodTypeInternals<((({
        currentValue: string;
        options: {
            name: string;
            value: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[] | {
            group: string;
            name: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[];
            _meta?: Record<string, unknown> | null | undefined;
        }[];
    } & {
        type: "select";
    }) | ({
        currentValue: boolean;
    } & {
        type: "boolean";
    })) & {
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        category?: string | null | undefined;
        description?: string | null | undefined;
    })[], ((({
        currentValue: string;
        options: {
            name: string;
            value: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[] | {
            group: string;
            name: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[];
            _meta?: Record<string, unknown> | null | undefined;
        }[];
    } & {
        type: "select";
    }) | ({
        currentValue: boolean;
    } & {
        type: "boolean";
    })) & {
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        category?: string | null | undefined;
        description?: string | null | undefined;
    })[]>>;
}, z.core.$strip>;
/**
 * Request parameters for setting a session mode.
 */
export declare const zSetSessionModeRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    modeId: z.ZodString;
    sessionId: z.ZodString;
}, z.core.$strip>;
/**
 * Response to `session/set_mode` method.
 */
export declare const zSetSessionModeResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
/**
 * Response to `nes/start`.
 */
export declare const zStartNesResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    sessionId: z.ZodString;
}, z.core.$strip>;
/**
 * Reasons why an agent stops processing a prompt turn.
 *
 * See protocol docs: [Stop Reasons](https://agentclientprotocol.com/protocol/prompt-turn#stop-reasons)
 */
export declare const zStopReason: z.ZodUnion<readonly [z.ZodLiteral<"end_turn">, z.ZodLiteral<"max_tokens">, z.ZodLiteral<"max_turn_requests">, z.ZodLiteral<"refusal">, z.ZodLiteral<"cancelled">]>;
/**
 * String format types for string properties in elicitation schemas.
 */
export declare const zStringFormat: z.ZodUnion<readonly [z.ZodLiteral<"email">, z.ZodLiteral<"uri">, z.ZodLiteral<"date">, z.ZodLiteral<"date-time">]>;
/**
 * Schema for string properties in an elicitation form.
 *
 * When `enum` or `oneOf` is set, this represents a single-select enum
 * with `"type": "string"`.
 */
export declare const zStringPropertySchema: z.ZodObject<{
    default: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    enum: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    format: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"email">, z.ZodLiteral<"uri">, z.ZodLiteral<"date">, z.ZodLiteral<"date-time">]>>>;
    maxLength: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
    minLength: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
    oneOf: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        const: z.ZodString;
        title: z.ZodString;
    }, z.core.$strip>>>>;
    pattern: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/**
 * Request for a code suggestion.
 */
export declare const zSuggestNesRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    context: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        diagnostics: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
            message: z.ZodString;
            range: z.ZodObject<{
                end: z.ZodObject<{
                    character: z.ZodInt;
                    line: z.ZodInt;
                }, z.core.$strip>;
                start: z.ZodObject<{
                    character: z.ZodInt;
                    line: z.ZodInt;
                }, z.core.$strip>;
            }, z.core.$strip>;
            severity: z.ZodUnion<readonly [z.ZodLiteral<"error">, z.ZodLiteral<"warning">, z.ZodLiteral<"information">, z.ZodLiteral<"hint">]>;
            uri: z.ZodString;
        }, z.core.$strip>>>, z.ZodTransform<{
            message: string;
            range: {
                end: {
                    character: number;
                    line: number;
                };
                start: {
                    character: number;
                    line: number;
                };
            };
            severity: "error" | "warning" | "information" | "hint";
            uri: string;
        }[], {
            message: string;
            range: {
                end: {
                    character: number;
                    line: number;
                };
                start: {
                    character: number;
                    line: number;
                };
            };
            severity: "error" | "warning" | "information" | "hint";
            uri: string;
        }[]>>>>>;
        editHistory: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
            diff: z.ZodString;
            uri: z.ZodString;
        }, z.core.$strip>>>, z.ZodTransform<{
            diff: string;
            uri: string;
        }[], {
            diff: string;
            uri: string;
        }[]>>>>>;
        openFiles: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
            languageId: z.ZodString;
            lastFocusedMs: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
            uri: z.ZodString;
            visibleRange: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                end: z.ZodObject<{
                    character: z.ZodInt;
                    line: z.ZodInt;
                }, z.core.$strip>;
                start: z.ZodObject<{
                    character: z.ZodInt;
                    line: z.ZodInt;
                }, z.core.$strip>;
            }, z.core.$strip>>>>;
        }, z.core.$strip>>>, z.ZodTransform<{
            languageId: string;
            uri: string;
            lastFocusedMs?: number | null | undefined;
            visibleRange?: {
                end: {
                    character: number;
                    line: number;
                };
                start: {
                    character: number;
                    line: number;
                };
            } | null | undefined;
        }[], {
            languageId: string;
            uri: string;
            lastFocusedMs?: number | null | undefined;
            visibleRange?: {
                end: {
                    character: number;
                    line: number;
                };
                start: {
                    character: number;
                    line: number;
                };
            } | null | undefined;
        }[]>>>>>;
        recentFiles: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
            languageId: z.ZodString;
            text: z.ZodString;
            uri: z.ZodString;
        }, z.core.$strip>>>, z.ZodTransform<{
            languageId: string;
            text: string;
            uri: string;
        }[], {
            languageId: string;
            text: string;
            uri: string;
        }[]>>>>>;
        relatedSnippets: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
            excerpts: z.ZodArray<z.ZodObject<{
                endLine: z.ZodInt;
                startLine: z.ZodInt;
                text: z.ZodString;
            }, z.core.$strip>>;
            uri: z.ZodString;
        }, z.core.$strip>>>, z.ZodTransform<{
            excerpts: {
                endLine: number;
                startLine: number;
                text: string;
            }[];
            uri: string;
        }[], {
            excerpts: {
                endLine: number;
                startLine: number;
                text: string;
            }[];
            uri: string;
        }[]>>>>>;
        userActions: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
            action: z.ZodString;
            position: z.ZodObject<{
                character: z.ZodInt;
                line: z.ZodInt;
            }, z.core.$strip>;
            timestampMs: z.ZodNumber;
            uri: z.ZodString;
        }, z.core.$strip>>>, z.ZodTransform<{
            action: string;
            position: {
                character: number;
                line: number;
            };
            timestampMs: number;
            uri: string;
        }[], {
            action: string;
            position: {
                character: number;
                line: number;
            };
            timestampMs: number;
            uri: string;
        }[]>>>>>;
    }, z.core.$strip>>>>;
    position: z.ZodObject<{
        character: z.ZodInt;
        line: z.ZodInt;
    }, z.core.$strip>;
    selection: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        end: z.ZodObject<{
            character: z.ZodInt;
            line: z.ZodInt;
        }, z.core.$strip>;
        start: z.ZodObject<{
            character: z.ZodInt;
            line: z.ZodInt;
        }, z.core.$strip>;
    }, z.core.$strip>>>>;
    sessionId: z.ZodString;
    triggerKind: z.ZodUnion<readonly [z.ZodLiteral<"automatic">, z.ZodLiteral<"diagnostic">, z.ZodLiteral<"manual">]>;
    uri: z.ZodString;
    version: z.ZodNumber;
}, z.core.$strip>;
/**
 * Response to `nes/suggest`.
 */
export declare const zSuggestNesResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    suggestions: z.ZodType<(({
        edits: {
            newText: string;
            range: {
                end: {
                    character: number;
                    line: number;
                };
                start: {
                    character: number;
                    line: number;
                };
            };
        }[];
        id: string;
        uri: string;
        cursorPosition?: {
            character: number;
            line: number;
        } | null | undefined;
    } & {
        kind: "edit";
    }) | ({
        id: string;
        position: {
            character: number;
            line: number;
        };
        uri: string;
    } & {
        kind: "jump";
    }) | ({
        id: string;
        newName: string;
        position: {
            character: number;
            line: number;
        };
        uri: string;
    } & {
        kind: "rename";
    }) | ({
        id: string;
        replace: string;
        search: string;
        uri: string;
        isRegex?: boolean | null | undefined;
    } & {
        kind: "searchAndReplace";
    }))[], (({
        edits: {
            newText: string;
            range: {
                end: {
                    character: number;
                    line: number;
                };
                start: {
                    character: number;
                    line: number;
                };
            };
        }[];
        id: string;
        uri: string;
        cursorPosition?: {
            character: number;
            line: number;
        } | null | undefined;
    } & {
        kind: "edit";
    }) | ({
        id: string;
        position: {
            character: number;
            line: number;
        };
        uri: string;
    } & {
        kind: "jump";
    }) | ({
        id: string;
        newName: string;
        position: {
            character: number;
            line: number;
        };
        uri: string;
    } & {
        kind: "rename";
    }) | ({
        id: string;
        replace: string;
        search: string;
        uri: string;
        isRegex?: boolean | null | undefined;
    } & {
        kind: "searchAndReplace";
    }))[], z.core.$ZodTypeInternals<(({
        edits: {
            newText: string;
            range: {
                end: {
                    character: number;
                    line: number;
                };
                start: {
                    character: number;
                    line: number;
                };
            };
        }[];
        id: string;
        uri: string;
        cursorPosition?: {
            character: number;
            line: number;
        } | null | undefined;
    } & {
        kind: "edit";
    }) | ({
        id: string;
        position: {
            character: number;
            line: number;
        };
        uri: string;
    } & {
        kind: "jump";
    }) | ({
        id: string;
        newName: string;
        position: {
            character: number;
            line: number;
        };
        uri: string;
    } & {
        kind: "rename";
    }) | ({
        id: string;
        replace: string;
        search: string;
        uri: string;
        isRegex?: boolean | null | undefined;
    } & {
        kind: "searchAndReplace";
    }))[], (({
        edits: {
            newText: string;
            range: {
                end: {
                    character: number;
                    line: number;
                };
                start: {
                    character: number;
                    line: number;
                };
            };
        }[];
        id: string;
        uri: string;
        cursorPosition?: {
            character: number;
            line: number;
        } | null | undefined;
    } & {
        kind: "edit";
    }) | ({
        id: string;
        position: {
            character: number;
            line: number;
        };
        uri: string;
    } & {
        kind: "jump";
    }) | ({
        id: string;
        newName: string;
        position: {
            character: number;
            line: number;
        };
        uri: string;
    } & {
        kind: "rename";
    }) | ({
        id: string;
        replace: string;
        search: string;
        uri: string;
        isRegex?: boolean | null | undefined;
    } & {
        kind: "searchAndReplace";
    }))[]>>;
}, z.core.$strip>;
/**
 * Embed a terminal created with `terminal/create` by its id.
 *
 * The terminal must be added before calling `terminal/release`.
 *
 * See protocol docs: [Terminal](https://agentclientprotocol.com/protocol/terminals)
 */
export declare const zTerminal: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    terminalId: z.ZodString;
}, z.core.$strip>;
/**
 * Exit status of a terminal command.
 */
export declare const zTerminalExitStatus: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    exitCode: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
    signal: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/**
 * Request to get the current output and status of a terminal.
 */
export declare const zTerminalOutputRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    sessionId: z.ZodString;
    terminalId: z.ZodString;
}, z.core.$strip>;
/**
 * Response containing the terminal output and exit status.
 */
export declare const zTerminalOutputResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    exitStatus: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        exitCode: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
        signal: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>>;
    output: z.ZodString;
    truncated: z.ZodBoolean;
}, z.core.$strip>;
/**
 * Text provided to or from an LLM.
 */
export declare const zTextContent: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
            assistant: "assistant";
            user: "user";
        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>>>;
    text: z.ZodString;
}, z.core.$strip>;
/**
 * A content change event for a document.
 *
 * When `range` is `None`, `text` is the full content of the document.
 * When `range` is `Some`, `text` replaces the given range.
 */
export declare const zTextDocumentContentChangeEvent: z.ZodObject<{
    range: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        end: z.ZodObject<{
            character: z.ZodInt;
            line: z.ZodInt;
        }, z.core.$strip>;
        start: z.ZodObject<{
            character: z.ZodInt;
            line: z.ZodInt;
        }, z.core.$strip>;
    }, z.core.$strip>>>;
    text: z.ZodString;
}, z.core.$strip>;
/**
 * Notification sent when a file is edited.
 */
export declare const zDidChangeDocumentNotification: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    contentChanges: z.ZodArray<z.ZodObject<{
        range: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            end: z.ZodObject<{
                character: z.ZodInt;
                line: z.ZodInt;
            }, z.core.$strip>;
            start: z.ZodObject<{
                character: z.ZodInt;
                line: z.ZodInt;
            }, z.core.$strip>;
        }, z.core.$strip>>>;
        text: z.ZodString;
    }, z.core.$strip>>;
    sessionId: z.ZodString;
    uri: z.ZodString;
    version: z.ZodNumber;
}, z.core.$strip>;
export declare const zClientNotification: z.ZodObject<{
    method: z.ZodString;
    params: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        sessionId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        languageId: z.ZodString;
        sessionId: z.ZodString;
        text: z.ZodString;
        uri: z.ZodString;
        version: z.ZodNumber;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        contentChanges: z.ZodArray<z.ZodObject<{
            range: z.ZodOptional<z.ZodNullable<z.ZodObject<{
                end: z.ZodObject<{
                    character: z.ZodInt;
                    line: z.ZodInt;
                }, z.core.$strip>;
                start: z.ZodObject<{
                    character: z.ZodInt;
                    line: z.ZodInt;
                }, z.core.$strip>;
            }, z.core.$strip>>>;
            text: z.ZodString;
        }, z.core.$strip>>;
        sessionId: z.ZodString;
        uri: z.ZodString;
        version: z.ZodNumber;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        sessionId: z.ZodString;
        uri: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        sessionId: z.ZodString;
        uri: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        position: z.ZodObject<{
            character: z.ZodInt;
            line: z.ZodInt;
        }, z.core.$strip>;
        sessionId: z.ZodString;
        uri: z.ZodString;
        version: z.ZodNumber;
        visibleRange: z.ZodObject<{
            end: z.ZodObject<{
                character: z.ZodInt;
                line: z.ZodInt;
            }, z.core.$strip>;
            start: z.ZodObject<{
                character: z.ZodInt;
                line: z.ZodInt;
            }, z.core.$strip>;
        }, z.core.$strip>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        id: z.ZodString;
        sessionId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        id: z.ZodString;
        reason: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"rejected">, z.ZodLiteral<"ignored">, z.ZodLiteral<"replaced">, z.ZodLiteral<"cancelled">]>>>>;
        sessionId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        connectionId: z.ZodString;
        method: z.ZodString;
        params: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>, z.ZodUnknown]>>>;
}, z.core.$strip>;
/**
 * How the agent wants document changes delivered.
 */
export declare const zTextDocumentSyncKind: z.ZodUnion<readonly [z.ZodLiteral<"full">, z.ZodLiteral<"incremental">]>;
/**
 * Capabilities for `document/didChange` events.
 */
export declare const zNesDocumentDidChangeCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    syncKind: z.ZodUnion<readonly [z.ZodLiteral<"full">, z.ZodLiteral<"incremental">]>;
}, z.core.$strip>;
/**
 * Document event capabilities the agent wants to receive.
 */
export declare const zNesDocumentEventCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    didChange: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        syncKind: z.ZodUnion<readonly [z.ZodLiteral<"full">, z.ZodLiteral<"incremental">]>;
    }, z.core.$strip>>>>;
    didClose: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>>>;
    didFocus: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>>>;
    didOpen: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>>>;
    didSave: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
/**
 * Event capabilities the agent can consume.
 */
export declare const zNesEventCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    document: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        didChange: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            syncKind: z.ZodUnion<readonly [z.ZodLiteral<"full">, z.ZodLiteral<"incremental">]>;
        }, z.core.$strip>>>>;
        didClose: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$strip>>>>;
        didFocus: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$strip>>>>;
        didOpen: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$strip>>>>;
        didSave: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$strip>>>>;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
/**
 * NES capabilities advertised by the agent during initialization.
 */
export declare const zNesCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    context: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        diagnostics: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$strip>>>>;
        editHistory: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            maxCount: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
        }, z.core.$strip>>>>;
        openFiles: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$strip>>>>;
        recentFiles: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            maxCount: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
        }, z.core.$strip>>>>;
        relatedSnippets: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$strip>>>>;
        userActions: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            maxCount: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
        }, z.core.$strip>>>>;
    }, z.core.$strip>>>>;
    events: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        document: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            didChange: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                syncKind: z.ZodUnion<readonly [z.ZodLiteral<"full">, z.ZodLiteral<"incremental">]>;
            }, z.core.$strip>>>>;
            didClose: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$strip>>>>;
            didFocus: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$strip>>>>;
            didOpen: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$strip>>>>;
            didSave: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$strip>>>>;
        }, z.core.$strip>>>>;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
/**
 * Capabilities supported by the agent.
 *
 * Advertised during initialization to inform the client about
 * available features and content types.
 *
 * See protocol docs: [Agent Capabilities](https://agentclientprotocol.com/protocol/initialization#agent-capabilities)
 */
export declare const zAgentCapabilities: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    auth: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        logout: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$strip>>>>;
    }, z.core.$strip>>>;
    loadSession: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    mcpCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        acp: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        http: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        sse: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>>>;
    nes: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        context: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            diagnostics: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$strip>>>>;
            editHistory: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                maxCount: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
            }, z.core.$strip>>>>;
            openFiles: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$strip>>>>;
            recentFiles: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                maxCount: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
            }, z.core.$strip>>>>;
            relatedSnippets: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$strip>>>>;
            userActions: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                maxCount: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
            }, z.core.$strip>>>>;
        }, z.core.$strip>>>>;
        events: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            document: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                didChange: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    syncKind: z.ZodUnion<readonly [z.ZodLiteral<"full">, z.ZodLiteral<"incremental">]>;
                }, z.core.$strip>>>>;
                didClose: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$strip>>>>;
                didFocus: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$strip>>>>;
                didOpen: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$strip>>>>;
                didSave: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$strip>>>>;
            }, z.core.$strip>>>>;
        }, z.core.$strip>>>>;
    }, z.core.$strip>>>>;
    positionEncoding: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"utf-16">, z.ZodLiteral<"utf-32">, z.ZodLiteral<"utf-8">]>>>>;
    promptCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        audio: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        embeddedContext: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        image: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>>>;
    providers: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>>>;
    sessionCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        additionalDirectories: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$strip>>>>;
        close: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$strip>>>>;
        delete: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$strip>>>>;
        fork: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$strip>>>>;
        list: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$strip>>>>;
        resume: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$strip>>>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
/**
 * Response to the `initialize` method.
 *
 * Contains the negotiated protocol version and agent capabilities.
 *
 * See protocol docs: [Initialization](https://agentclientprotocol.com/protocol/initialization)
 */
export declare const zInitializeResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    agentCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        auth: z.ZodDefault<z.ZodOptional<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            logout: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$strip>>>>;
        }, z.core.$strip>>>;
        loadSession: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        mcpCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            acp: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            http: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            sse: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, z.core.$strip>>>;
        nes: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            context: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                diagnostics: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$strip>>>>;
                editHistory: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    maxCount: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
                }, z.core.$strip>>>>;
                openFiles: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$strip>>>>;
                recentFiles: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    maxCount: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
                }, z.core.$strip>>>>;
                relatedSnippets: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$strip>>>>;
                userActions: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    maxCount: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
                }, z.core.$strip>>>>;
            }, z.core.$strip>>>>;
            events: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                document: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    didChange: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        syncKind: z.ZodUnion<readonly [z.ZodLiteral<"full">, z.ZodLiteral<"incremental">]>;
                    }, z.core.$strip>>>>;
                    didClose: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    }, z.core.$strip>>>>;
                    didFocus: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    }, z.core.$strip>>>>;
                    didOpen: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    }, z.core.$strip>>>>;
                    didSave: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    }, z.core.$strip>>>>;
                }, z.core.$strip>>>>;
            }, z.core.$strip>>>>;
        }, z.core.$strip>>>>;
        positionEncoding: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"utf-16">, z.ZodLiteral<"utf-32">, z.ZodLiteral<"utf-8">]>>>>;
        promptCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audio: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            embeddedContext: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            image: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, z.core.$strip>>>;
        providers: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, z.core.$strip>>>>;
        sessionCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            additionalDirectories: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$strip>>>>;
            close: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$strip>>>>;
            delete: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$strip>>>>;
            fork: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$strip>>>>;
            list: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$strip>>>>;
            resume: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$strip>>>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>>;
    agentInfo: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        name: z.ZodString;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        version: z.ZodString;
    }, z.core.$strip>>>>;
    authMethods: z.ZodCatch<z.ZodDefault<z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        id: z.ZodString;
        link: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        vars: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            label: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            optional: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            secret: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"env_var">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        args: z.ZodOptional<z.ZodArray<z.ZodString>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"terminal">;
    }, z.core.$strip>>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        id: z.ZodString;
        name: z.ZodString;
    }, z.core.$strip>]>>>, z.ZodTransform<({
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        description?: string | null | undefined;
    } | ({
        id: string;
        name: string;
        vars: {
            name: string;
            optional: boolean;
            secret: boolean;
            _meta?: Record<string, unknown> | null | undefined;
            label?: string | null | undefined;
        }[];
        _meta?: Record<string, unknown> | null | undefined;
        description?: string | null | undefined;
        link?: string | null | undefined;
    } & {
        type: "env_var";
    }) | ({
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        args?: string[] | undefined;
        description?: string | null | undefined;
        env?: Record<string, string> | undefined;
    } & {
        type: "terminal";
    }))[], ({
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        description?: string | null | undefined;
    } | ({
        id: string;
        name: string;
        vars: {
            name: string;
            optional: boolean;
            secret: boolean;
            _meta?: Record<string, unknown> | null | undefined;
            label?: string | null | undefined;
        }[];
        _meta?: Record<string, unknown> | null | undefined;
        description?: string | null | undefined;
        link?: string | null | undefined;
    } & {
        type: "env_var";
    }) | ({
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        args?: string[] | undefined;
        description?: string | null | undefined;
        env?: Record<string, string> | undefined;
    } & {
        type: "terminal";
    }))[]>>>>>;
    protocolVersion: z.ZodInt;
}, z.core.$strip>;
/**
 * Text-based resource contents.
 */
export declare const zTextResourceContents: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    text: z.ZodString;
    uri: z.ZodString;
}, z.core.$strip>;
/**
 * Resource content that can be embedded in a message.
 */
export declare const zEmbeddedResourceResource: z.ZodUnion<readonly [z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    text: z.ZodString;
    uri: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    blob: z.ZodString;
    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    uri: z.ZodString;
}, z.core.$strip>]>;
/**
 * The contents of a resource, embedded into a prompt or tool call result.
 */
export declare const zEmbeddedResource: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
            assistant: "assistant";
            user: "user";
        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>>>;
    resource: z.ZodUnion<readonly [z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        text: z.ZodString;
        uri: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        blob: z.ZodString;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        uri: z.ZodString;
    }, z.core.$strip>]>;
}, z.core.$strip>;
/**
 * Content blocks represent displayable information in the Agent Client Protocol.
 *
 * They provide a structured way to handle various types of user-facing content—whether
 * it's text from language models, images for analysis, or embedded resources for context.
 *
 * Content blocks appear in:
 * - User prompts sent via `session/prompt`
 * - Language model output streamed through `session/update` notifications
 * - Progress updates and results from tool calls
 *
 * This structure is compatible with the Model Context Protocol (MCP), enabling
 * agents to seamlessly forward content from MCP tool outputs without transformation.
 *
 * See protocol docs: [Content](https://agentclientprotocol.com/protocol/content)
 */
export declare const zContentBlock: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
            assistant: "assistant";
            user: "user";
        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>>>;
    text: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"text">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
            assistant: "assistant";
            user: "user";
        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>>>;
    data: z.ZodString;
    mimeType: z.ZodString;
    uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"image">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
            assistant: "assistant";
            user: "user";
        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>>>;
    data: z.ZodString;
    mimeType: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"audio">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
            assistant: "assistant";
            user: "user";
        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    name: z.ZodString;
    size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    uri: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"resource_link">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
            assistant: "assistant";
            user: "user";
        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>>>;
    resource: z.ZodUnion<readonly [z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        text: z.ZodString;
        uri: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        blob: z.ZodString;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        uri: z.ZodString;
    }, z.core.$strip>]>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"resource">;
}, z.core.$strip>>]>;
/**
 * Standard content block (text, images, resources).
 */
export declare const zContent: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        text: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"text">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        uri: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"resource_link">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        resource: z.ZodUnion<readonly [z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            text: z.ZodString;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            blob: z.ZodString;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$strip>]>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
    }, z.core.$strip>>]>;
}, z.core.$strip>;
/**
 * A streamed item of content
 */
export declare const zContentChunk: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        text: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"text">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        uri: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"resource_link">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        resource: z.ZodUnion<readonly [z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            text: z.ZodString;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            blob: z.ZodString;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$strip>]>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
    }, z.core.$strip>>]>;
    messageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/**
 * Request parameters for sending a user prompt to the agent.
 *
 * Contains the user's message and any additional context.
 *
 * See protocol docs: [User Message](https://agentclientprotocol.com/protocol/prompt-turn#1-user-message)
 */
export declare const zPromptRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    prompt: z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        text: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"text">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        uri: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"resource_link">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        resource: z.ZodUnion<readonly [z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            text: z.ZodString;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            blob: z.ZodString;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$strip>]>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
    }, z.core.$strip>>]>>;
    sessionId: z.ZodString;
}, z.core.$strip>;
/**
 * Items definition for titled multi-select enum properties.
 */
export declare const zTitledMultiSelectItems: z.ZodObject<{
    anyOf: z.ZodArray<z.ZodObject<{
        const: z.ZodString;
        title: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Content produced by a tool call.
 *
 * Tool calls can produce different types of content including
 * standard content blocks (text, images) or file diffs.
 *
 * See protocol docs: [Content](https://agentclientprotocol.com/protocol/tool-calls#content)
 */
export declare const zToolCallContent: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        text: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"text">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        uri: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"resource_link">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        resource: z.ZodUnion<readonly [z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            text: z.ZodString;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            blob: z.ZodString;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$strip>]>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
    }, z.core.$strip>>]>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"content">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    newText: z.ZodString;
    oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    path: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"diff">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    terminalId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"terminal">;
}, z.core.$strip>>]>;
/**
 * Unique identifier for a tool call within a session.
 */
export declare const zToolCallId: z.ZodString;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Session-scoped elicitation, optionally tied to a specific tool call.
 *
 * When `tool_call_id` is set, the elicitation is tied to a specific tool call.
 * This is useful when an agent receives an elicitation from an MCP server
 * during a tool call and needs to redirect it to the user.
 *
 * @experimental
 */
export declare const zElicitationSessionScope: z.ZodObject<{
    sessionId: z.ZodString;
    toolCallId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * URL-based elicitation mode where the client directs the user to a URL.
 *
 * @experimental
 */
export declare const zElicitationUrlMode: z.ZodIntersection<z.ZodUnion<readonly [z.ZodObject<{
    sessionId: z.ZodString;
    toolCallId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
    requestId: z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
}, z.core.$strip>]>, z.ZodObject<{
    elicitationId: z.ZodString;
    url: z.ZodURL;
}, z.core.$strip>>;
/**
 * A file location being accessed or modified by a tool.
 *
 * Enables clients to implement "follow-along" features that track
 * which files the agent is working with in real-time.
 *
 * See protocol docs: [Following the Agent](https://agentclientprotocol.com/protocol/tool-calls#following-the-agent)
 */
export declare const zToolCallLocation: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    line: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
    path: z.ZodString;
}, z.core.$strip>;
/**
 * Execution status of a tool call.
 *
 * Tool calls progress through different statuses during their lifecycle.
 *
 * See protocol docs: [Status](https://agentclientprotocol.com/protocol/tool-calls#status)
 */
export declare const zToolCallStatus: z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>;
/**
 * Categories of tools that can be invoked.
 *
 * Tool kinds help clients choose appropriate icons and optimize how they
 * display tool execution progress.
 *
 * See protocol docs: [Creating](https://agentclientprotocol.com/protocol/tool-calls#creating)
 */
export declare const zToolKind: z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"switch_mode">, z.ZodLiteral<"other">]>;
/**
 * Represents a tool call that the language model has requested.
 *
 * Tool calls are actions that the agent executes on behalf of the language model,
 * such as reading files, executing code, or fetching data from external sources.
 *
 * See protocol docs: [Tool Calls](https://agentclientprotocol.com/protocol/tool-calls)
 */
export declare const zToolCall: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodCatch<z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            text: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"text">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"resource_link">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                blob: z.ZodString;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$strip>]>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
        }, z.core.$strip>>]>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"content">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        newText: z.ZodString;
        oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        path: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"diff">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        terminalId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"terminal">;
    }, z.core.$strip>>]>>>, z.ZodTransform<(({
        content: ({
            text: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "text";
        }) | ({
            data: string;
            mimeType: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
            uri?: string | null | undefined;
        } & {
            type: "image";
        }) | ({
            data: string;
            mimeType: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "audio";
        }) | ({
            name: string;
            uri: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
            description?: string | null | undefined;
            mimeType?: string | null | undefined;
            size?: number | null | undefined;
            title?: string | null | undefined;
        } & {
            type: "resource_link";
        }) | ({
            resource: {
                blob: string;
                uri: string;
                _meta?: Record<string, unknown> | null | undefined;
                mimeType?: string | null | undefined;
            } | {
                text: string;
                uri: string;
                _meta?: Record<string, unknown> | null | undefined;
                mimeType?: string | null | undefined;
            };
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "resource";
        });
        _meta?: Record<string, unknown> | null | undefined;
    } & {
        type: "content";
    }) | ({
        newText: string;
        path: string;
        _meta?: Record<string, unknown> | null | undefined;
        oldText?: string | null | undefined;
    } & {
        type: "diff";
    }) | ({
        terminalId: string;
        _meta?: Record<string, unknown> | null | undefined;
    } & {
        type: "terminal";
    }))[], (({
        content: ({
            text: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "text";
        }) | ({
            data: string;
            mimeType: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
            uri?: string | null | undefined;
        } & {
            type: "image";
        }) | ({
            data: string;
            mimeType: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "audio";
        }) | ({
            name: string;
            uri: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
            description?: string | null | undefined;
            mimeType?: string | null | undefined;
            size?: number | null | undefined;
            title?: string | null | undefined;
        } & {
            type: "resource_link";
        }) | ({
            resource: {
                blob: string;
                uri: string;
                _meta?: Record<string, unknown> | null | undefined;
                mimeType?: string | null | undefined;
            } | {
                text: string;
                uri: string;
                _meta?: Record<string, unknown> | null | undefined;
                mimeType?: string | null | undefined;
            };
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "resource";
        });
        _meta?: Record<string, unknown> | null | undefined;
    } & {
        type: "content";
    }) | ({
        newText: string;
        path: string;
        _meta?: Record<string, unknown> | null | undefined;
        oldText?: string | null | undefined;
    } & {
        type: "diff";
    }) | ({
        terminalId: string;
        _meta?: Record<string, unknown> | null | undefined;
    } & {
        type: "terminal";
    }))[]>>>>;
    kind: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"switch_mode">, z.ZodLiteral<"other">]>>;
    locations: z.ZodCatch<z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        line: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
        path: z.ZodString;
    }, z.core.$strip>>>, z.ZodTransform<{
        path: string;
        _meta?: Record<string, unknown> | null | undefined;
        line?: number | null | undefined;
    }[], {
        path: string;
        _meta?: Record<string, unknown> | null | undefined;
        line?: number | null | undefined;
    }[]>>>>;
    rawInput: z.ZodOptional<z.ZodUnknown>;
    rawOutput: z.ZodOptional<z.ZodUnknown>;
    status: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>>;
    title: z.ZodString;
    toolCallId: z.ZodString;
}, z.core.$strip>;
/**
 * An update to an existing tool call.
 *
 * Used to report progress and results as tools execute. All fields except
 * the tool call ID are optional - only changed fields need to be included.
 *
 * See protocol docs: [Updating](https://agentclientprotocol.com/protocol/tool-calls#updating)
 */
export declare const zToolCallUpdate: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            text: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"text">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"resource_link">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                blob: z.ZodString;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$strip>]>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
        }, z.core.$strip>>]>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"content">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        newText: z.ZodString;
        oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        path: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"diff">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        terminalId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"terminal">;
    }, z.core.$strip>>]>>>, z.ZodTransform<(({
        content: ({
            text: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "text";
        }) | ({
            data: string;
            mimeType: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
            uri?: string | null | undefined;
        } & {
            type: "image";
        }) | ({
            data: string;
            mimeType: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "audio";
        }) | ({
            name: string;
            uri: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
            description?: string | null | undefined;
            mimeType?: string | null | undefined;
            size?: number | null | undefined;
            title?: string | null | undefined;
        } & {
            type: "resource_link";
        }) | ({
            resource: {
                blob: string;
                uri: string;
                _meta?: Record<string, unknown> | null | undefined;
                mimeType?: string | null | undefined;
            } | {
                text: string;
                uri: string;
                _meta?: Record<string, unknown> | null | undefined;
                mimeType?: string | null | undefined;
            };
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "resource";
        });
        _meta?: Record<string, unknown> | null | undefined;
    } & {
        type: "content";
    }) | ({
        newText: string;
        path: string;
        _meta?: Record<string, unknown> | null | undefined;
        oldText?: string | null | undefined;
    } & {
        type: "diff";
    }) | ({
        terminalId: string;
        _meta?: Record<string, unknown> | null | undefined;
    } & {
        type: "terminal";
    }))[], (({
        content: ({
            text: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "text";
        }) | ({
            data: string;
            mimeType: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
            uri?: string | null | undefined;
        } & {
            type: "image";
        }) | ({
            data: string;
            mimeType: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "audio";
        }) | ({
            name: string;
            uri: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
            description?: string | null | undefined;
            mimeType?: string | null | undefined;
            size?: number | null | undefined;
            title?: string | null | undefined;
        } & {
            type: "resource_link";
        }) | ({
            resource: {
                blob: string;
                uri: string;
                _meta?: Record<string, unknown> | null | undefined;
                mimeType?: string | null | undefined;
            } | {
                text: string;
                uri: string;
                _meta?: Record<string, unknown> | null | undefined;
                mimeType?: string | null | undefined;
            };
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "resource";
        });
        _meta?: Record<string, unknown> | null | undefined;
    } & {
        type: "content";
    }) | ({
        newText: string;
        path: string;
        _meta?: Record<string, unknown> | null | undefined;
        oldText?: string | null | undefined;
    } & {
        type: "diff";
    }) | ({
        terminalId: string;
        _meta?: Record<string, unknown> | null | undefined;
    } & {
        type: "terminal";
    }))[]>>>>>;
    kind: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"switch_mode">, z.ZodLiteral<"other">]>>>>;
    locations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        line: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
        path: z.ZodString;
    }, z.core.$strip>>>, z.ZodTransform<{
        path: string;
        _meta?: Record<string, unknown> | null | undefined;
        line?: number | null | undefined;
    }[], {
        path: string;
        _meta?: Record<string, unknown> | null | undefined;
        line?: number | null | undefined;
    }[]>>>>>;
    rawInput: z.ZodOptional<z.ZodUnknown>;
    rawOutput: z.ZodOptional<z.ZodUnknown>;
    status: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>>>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    toolCallId: z.ZodString;
}, z.core.$strip>;
/**
 * Request for user permission to execute a tool call.
 *
 * Sent when the agent needs authorization before performing a sensitive operation.
 *
 * See protocol docs: [Requesting Permission](https://agentclientprotocol.com/protocol/tool-calls#requesting-permission)
 */
export declare const zRequestPermissionRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    options: z.ZodArray<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        kind: z.ZodUnion<readonly [z.ZodLiteral<"allow_once">, z.ZodLiteral<"allow_always">, z.ZodLiteral<"reject_once">, z.ZodLiteral<"reject_always">]>;
        name: z.ZodString;
        optionId: z.ZodString;
    }, z.core.$strip>>;
    sessionId: z.ZodString;
    toolCall: z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                text: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"text">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"resource_link">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                resource: z.ZodUnion<readonly [z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    text: z.ZodString;
                    uri: z.ZodString;
                }, z.core.$strip>, z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    blob: z.ZodString;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$strip>]>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"resource">;
            }, z.core.$strip>>]>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"content">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            newText: z.ZodString;
            oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            path: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"diff">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            terminalId: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"terminal">;
        }, z.core.$strip>>]>>>, z.ZodTransform<(({
            content: ({
                text: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
            } & {
                type: "text";
            }) | ({
                data: string;
                mimeType: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
                uri?: string | null | undefined;
            } & {
                type: "image";
            }) | ({
                data: string;
                mimeType: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
            } & {
                type: "audio";
            }) | ({
                name: string;
                uri: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
                description?: string | null | undefined;
                mimeType?: string | null | undefined;
                size?: number | null | undefined;
                title?: string | null | undefined;
            } & {
                type: "resource_link";
            }) | ({
                resource: {
                    blob: string;
                    uri: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    mimeType?: string | null | undefined;
                } | {
                    text: string;
                    uri: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    mimeType?: string | null | undefined;
                };
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
            } & {
                type: "resource";
            });
            _meta?: Record<string, unknown> | null | undefined;
        } & {
            type: "content";
        }) | ({
            newText: string;
            path: string;
            _meta?: Record<string, unknown> | null | undefined;
            oldText?: string | null | undefined;
        } & {
            type: "diff";
        }) | ({
            terminalId: string;
            _meta?: Record<string, unknown> | null | undefined;
        } & {
            type: "terminal";
        }))[], (({
            content: ({
                text: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
            } & {
                type: "text";
            }) | ({
                data: string;
                mimeType: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
                uri?: string | null | undefined;
            } & {
                type: "image";
            }) | ({
                data: string;
                mimeType: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
            } & {
                type: "audio";
            }) | ({
                name: string;
                uri: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
                description?: string | null | undefined;
                mimeType?: string | null | undefined;
                size?: number | null | undefined;
                title?: string | null | undefined;
            } & {
                type: "resource_link";
            }) | ({
                resource: {
                    blob: string;
                    uri: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    mimeType?: string | null | undefined;
                } | {
                    text: string;
                    uri: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    mimeType?: string | null | undefined;
                };
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
            } & {
                type: "resource";
            });
            _meta?: Record<string, unknown> | null | undefined;
        } & {
            type: "content";
        }) | ({
            newText: string;
            path: string;
            _meta?: Record<string, unknown> | null | undefined;
            oldText?: string | null | undefined;
        } & {
            type: "diff";
        }) | ({
            terminalId: string;
            _meta?: Record<string, unknown> | null | undefined;
        } & {
            type: "terminal";
        }))[]>>>>>;
        kind: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"switch_mode">, z.ZodLiteral<"other">]>>>>;
        locations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            line: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
            path: z.ZodString;
        }, z.core.$strip>>>, z.ZodTransform<{
            path: string;
            _meta?: Record<string, unknown> | null | undefined;
            line?: number | null | undefined;
        }[], {
            path: string;
            _meta?: Record<string, unknown> | null | undefined;
            line?: number | null | undefined;
        }[]>>>>>;
        rawInput: z.ZodOptional<z.ZodUnknown>;
        rawOutput: z.ZodOptional<z.ZodUnknown>;
        status: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>>>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        toolCallId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
/**
 * All text that was typed after the command name is provided as input.
 */
export declare const zUnstructuredCommandInput: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    hint: z.ZodString;
}, z.core.$strip>;
/**
 * unstructured
 *
 * All text that was typed after the command name is provided as input.
 */
export declare const zAvailableCommandInput: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    hint: z.ZodString;
}, z.core.$strip>;
/**
 * Information about a command.
 */
export declare const zAvailableCommand: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    description: z.ZodString;
    input: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        hint: z.ZodString;
    }, z.core.$strip>>>>;
    name: z.ZodString;
}, z.core.$strip>;
/**
 * Available commands are ready or have changed
 */
export declare const zAvailableCommandsUpdate: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    availableCommands: z.ZodType<{
        description: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        input?: {
            hint: string;
            _meta?: Record<string, unknown> | null | undefined;
        } | null | undefined;
    }[], {
        description: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        input?: {
            hint: string;
            _meta?: Record<string, unknown> | null | undefined;
        } | null | undefined;
    }[], z.core.$ZodTypeInternals<{
        description: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        input?: {
            hint: string;
            _meta?: Record<string, unknown> | null | undefined;
        } | null | undefined;
    }[], {
        description: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        input?: {
            hint: string;
            _meta?: Record<string, unknown> | null | undefined;
        } | null | undefined;
    }[]>>;
}, z.core.$strip>;
/**
 * Items definition for untitled multi-select enum properties.
 */
export declare const zUntitledMultiSelectItems: z.ZodObject<{
    enum: z.ZodArray<z.ZodString>;
    type: z.ZodLiteral<"string">;
}, z.core.$strip>;
/**
 * Items for a multi-select (array) property schema.
 */
export declare const zMultiSelectItems: z.ZodUnion<readonly [z.ZodObject<{
    enum: z.ZodArray<z.ZodString>;
    type: z.ZodLiteral<"string">;
}, z.core.$strip>, z.ZodObject<{
    anyOf: z.ZodArray<z.ZodObject<{
        const: z.ZodString;
        title: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>]>;
/**
 * Schema for multi-select (array) properties in an elicitation form.
 */
export declare const zMultiSelectPropertySchema: z.ZodObject<{
    default: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    items: z.ZodUnion<readonly [z.ZodObject<{
        enum: z.ZodArray<z.ZodString>;
        type: z.ZodLiteral<"string">;
    }, z.core.$strip>, z.ZodObject<{
        anyOf: z.ZodArray<z.ZodObject<{
            const: z.ZodString;
            title: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>]>;
    maxItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    minItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/**
 * Property schema for elicitation form fields.
 *
 * Each variant corresponds to a JSON Schema `"type"` value.
 * Single-select enums use the `String` variant with `enum` or `oneOf` set.
 * Multi-select enums use the `Array` variant.
 */
export declare const zElicitationPropertySchema: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
    default: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    enum: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    format: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"email">, z.ZodLiteral<"uri">, z.ZodLiteral<"date">, z.ZodLiteral<"date-time">]>>>;
    maxLength: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
    minLength: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
    oneOf: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        const: z.ZodString;
        title: z.ZodString;
    }, z.core.$strip>>>>;
    pattern: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"string">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"number">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"integer">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    default: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"boolean">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    default: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    items: z.ZodUnion<readonly [z.ZodObject<{
        enum: z.ZodArray<z.ZodString>;
        type: z.ZodLiteral<"string">;
    }, z.core.$strip>, z.ZodObject<{
        anyOf: z.ZodArray<z.ZodObject<{
            const: z.ZodString;
            title: z.ZodString;
        }, z.core.$strip>>;
    }, z.core.$strip>]>;
    maxItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    minItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"array">;
}, z.core.$strip>>]>;
/**
 * Type-safe elicitation schema for requesting structured user input.
 *
 * This represents a JSON Schema object with primitive-typed properties,
 * as required by the elicitation specification.
 */
export declare const zElicitationSchema: z.ZodObject<{
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    properties: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        default: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        enum: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
        format: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"email">, z.ZodLiteral<"uri">, z.ZodLiteral<"date">, z.ZodLiteral<"date-time">]>>>;
        maxLength: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
        minLength: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
        oneOf: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
            const: z.ZodString;
            title: z.ZodString;
        }, z.core.$strip>>>>;
        pattern: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"string">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"number">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"integer">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        default: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"boolean">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        default: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        items: z.ZodUnion<readonly [z.ZodObject<{
            enum: z.ZodArray<z.ZodString>;
            type: z.ZodLiteral<"string">;
        }, z.core.$strip>, z.ZodObject<{
            anyOf: z.ZodArray<z.ZodObject<{
                const: z.ZodString;
                title: z.ZodString;
            }, z.core.$strip>>;
        }, z.core.$strip>]>;
        maxItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        minItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"array">;
    }, z.core.$strip>>]>>>>;
    required: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    type: z.ZodDefault<z.ZodOptional<z.ZodLiteral<"object">>>;
}, z.core.$strip>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Form-based elicitation mode where the client renders a form from the provided schema.
 *
 * @experimental
 */
export declare const zElicitationFormMode: z.ZodIntersection<z.ZodUnion<readonly [z.ZodObject<{
    sessionId: z.ZodString;
    toolCallId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
    requestId: z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
}, z.core.$strip>]>, z.ZodObject<{
    requestedSchema: z.ZodObject<{
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        properties: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            default: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            enum: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
            format: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"email">, z.ZodLiteral<"uri">, z.ZodLiteral<"date">, z.ZodLiteral<"date-time">]>>>;
            maxLength: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
            minLength: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
            oneOf: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
                const: z.ZodString;
                title: z.ZodString;
            }, z.core.$strip>>>>;
            pattern: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"string">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"number">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"integer">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            default: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"boolean">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            default: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            items: z.ZodUnion<readonly [z.ZodObject<{
                enum: z.ZodArray<z.ZodString>;
                type: z.ZodLiteral<"string">;
            }, z.core.$strip>, z.ZodObject<{
                anyOf: z.ZodArray<z.ZodObject<{
                    const: z.ZodString;
                    title: z.ZodString;
                }, z.core.$strip>>;
            }, z.core.$strip>]>;
            maxItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            minItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"array">;
        }, z.core.$strip>>]>>>>;
        required: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        type: z.ZodDefault<z.ZodOptional<z.ZodLiteral<"object">>>;
    }, z.core.$strip>;
}, z.core.$strip>>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Request from the agent to elicit structured user input.
 *
 * The agent sends this to the client to request information from the user,
 * either via a form or by directing them to a URL.
 * Elicitations are tied to a session (optionally a tool call) or a request.
 *
 * @experimental
 */
export declare const zCreateElicitationRequest: z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodIntersection<z.ZodUnion<readonly [z.ZodObject<{
    sessionId: z.ZodString;
    toolCallId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
    requestId: z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
}, z.core.$strip>]>, z.ZodObject<{
    requestedSchema: z.ZodObject<{
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        properties: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            default: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            enum: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
            format: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"email">, z.ZodLiteral<"uri">, z.ZodLiteral<"date">, z.ZodLiteral<"date-time">]>>>;
            maxLength: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
            minLength: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
            oneOf: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
                const: z.ZodString;
                title: z.ZodString;
            }, z.core.$strip>>>>;
            pattern: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"string">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"number">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"integer">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            default: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"boolean">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            default: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            items: z.ZodUnion<readonly [z.ZodObject<{
                enum: z.ZodArray<z.ZodString>;
                type: z.ZodLiteral<"string">;
            }, z.core.$strip>, z.ZodObject<{
                anyOf: z.ZodArray<z.ZodObject<{
                    const: z.ZodString;
                    title: z.ZodString;
                }, z.core.$strip>>;
            }, z.core.$strip>]>;
            maxItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            minItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"array">;
        }, z.core.$strip>>]>>>>;
        required: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        type: z.ZodDefault<z.ZodOptional<z.ZodLiteral<"object">>>;
    }, z.core.$strip>;
}, z.core.$strip>>, z.ZodObject<{
    mode: z.ZodLiteral<"form">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodIntersection<z.ZodUnion<readonly [z.ZodObject<{
    sessionId: z.ZodString;
    toolCallId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
    requestId: z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
}, z.core.$strip>]>, z.ZodObject<{
    elicitationId: z.ZodString;
    url: z.ZodURL;
}, z.core.$strip>>, z.ZodObject<{
    mode: z.ZodLiteral<"url">;
}, z.core.$strip>>]>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    message: z.ZodString;
}, z.core.$strip>>;
/**
 * **UNSTABLE**
 *
 * This capability is not part of the spec yet, and may be removed or changed at any point.
 *
 * Token usage information for a prompt turn.
 *
 * @experimental
 */
export declare const zUsage: z.ZodObject<{
    cachedReadTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    cachedWriteTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    inputTokens: z.ZodNumber;
    outputTokens: z.ZodNumber;
    thoughtTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    totalTokens: z.ZodNumber;
}, z.core.$strip>;
/**
 * Response from processing a user prompt.
 *
 * See protocol docs: [Check for Completion](https://agentclientprotocol.com/protocol/prompt-turn#4-check-for-completion)
 */
export declare const zPromptResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    stopReason: z.ZodUnion<readonly [z.ZodLiteral<"end_turn">, z.ZodLiteral<"max_tokens">, z.ZodLiteral<"max_turn_requests">, z.ZodLiteral<"refusal">, z.ZodLiteral<"cancelled">]>;
    usage: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        cachedReadTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        cachedWriteTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        inputTokens: z.ZodNumber;
        outputTokens: z.ZodNumber;
        thoughtTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        totalTokens: z.ZodNumber;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
export declare const zAgentResponse: z.ZodUnion<readonly [z.ZodObject<{
    id: z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    result: z.ZodUnion<readonly [z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        agentCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            auth: z.ZodDefault<z.ZodOptional<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                logout: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$strip>>>>;
            }, z.core.$strip>>>;
            loadSession: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            mcpCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                acp: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                http: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                sse: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            }, z.core.$strip>>>;
            nes: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                context: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    diagnostics: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    }, z.core.$strip>>>>;
                    editHistory: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        maxCount: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
                    }, z.core.$strip>>>>;
                    openFiles: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    }, z.core.$strip>>>>;
                    recentFiles: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        maxCount: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
                    }, z.core.$strip>>>>;
                    relatedSnippets: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    }, z.core.$strip>>>>;
                    userActions: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        maxCount: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
                    }, z.core.$strip>>>>;
                }, z.core.$strip>>>>;
                events: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    document: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        didChange: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                            syncKind: z.ZodUnion<readonly [z.ZodLiteral<"full">, z.ZodLiteral<"incremental">]>;
                        }, z.core.$strip>>>>;
                        didClose: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        }, z.core.$strip>>>>;
                        didFocus: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        }, z.core.$strip>>>>;
                        didOpen: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        }, z.core.$strip>>>>;
                        didSave: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        }, z.core.$strip>>>>;
                    }, z.core.$strip>>>>;
                }, z.core.$strip>>>>;
            }, z.core.$strip>>>>;
            positionEncoding: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"utf-16">, z.ZodLiteral<"utf-32">, z.ZodLiteral<"utf-8">]>>>>;
            promptCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audio: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                embeddedContext: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                image: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            }, z.core.$strip>>>;
            providers: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$strip>>>>;
            sessionCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                additionalDirectories: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$strip>>>>;
                close: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$strip>>>>;
                delete: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$strip>>>>;
                fork: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$strip>>>>;
                list: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$strip>>>>;
                resume: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$strip>>>>;
            }, z.core.$strip>>>;
        }, z.core.$strip>>>;
        agentInfo: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            version: z.ZodString;
        }, z.core.$strip>>>>;
        authMethods: z.ZodCatch<z.ZodDefault<z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            id: z.ZodString;
            link: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            vars: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                label: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                optional: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                secret: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            }, z.core.$strip>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"env_var">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            args: z.ZodOptional<z.ZodArray<z.ZodString>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"terminal">;
        }, z.core.$strip>>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$strip>]>>>, z.ZodTransform<({
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        } | ({
            id: string;
            name: string;
            vars: {
                name: string;
                optional: boolean;
                secret: boolean;
                _meta?: Record<string, unknown> | null | undefined;
                label?: string | null | undefined;
            }[];
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
            link?: string | null | undefined;
        } & {
            type: "env_var";
        }) | ({
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            args?: string[] | undefined;
            description?: string | null | undefined;
            env?: Record<string, string> | undefined;
        } & {
            type: "terminal";
        }))[], ({
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        } | ({
            id: string;
            name: string;
            vars: {
                name: string;
                optional: boolean;
                secret: boolean;
                _meta?: Record<string, unknown> | null | undefined;
                label?: string | null | undefined;
            }[];
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
            link?: string | null | undefined;
        } & {
            type: "env_var";
        }) | ({
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            args?: string[] | undefined;
            description?: string | null | undefined;
            env?: Record<string, string> | undefined;
        } & {
            type: "terminal";
        }))[]>>>>>;
        protocolVersion: z.ZodInt;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        providers: z.ZodType<{
            id: string;
            required: boolean;
            supported: string[];
            _meta?: Record<string, unknown> | null | undefined;
            current?: {
                apiType: string;
                baseUrl: string;
            } | null | undefined;
        }[], {
            id: string;
            required: boolean;
            supported: string[];
            _meta?: Record<string, unknown> | null | undefined;
            current?: {
                apiType: string;
                baseUrl: string;
            } | null | undefined;
        }[], z.core.$ZodTypeInternals<{
            id: string;
            required: boolean;
            supported: string[];
            _meta?: Record<string, unknown> | null | undefined;
            current?: {
                apiType: string;
                baseUrl: string;
            } | null | undefined;
        }[], {
            id: string;
            required: boolean;
            supported: string[];
            _meta?: Record<string, unknown> | null | undefined;
            current?: {
                apiType: string;
                baseUrl: string;
            } | null | undefined;
        }[]>>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        configOptions: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            currentValue: z.ZodString;
            options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$strip>>, z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                group: z.ZodString;
                name: z.ZodString;
                options: z.ZodArray<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    name: z.ZodString;
                    value: z.ZodString;
                }, z.core.$strip>>;
            }, z.core.$strip>>]>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"select">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            currentValue: z.ZodBoolean;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"boolean">;
        }, z.core.$strip>>]>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            category: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$strip>>>>, z.ZodTransform<((({
            currentValue: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[] | {
                group: string;
                name: string;
                options: {
                    name: string;
                    value: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    description?: string | null | undefined;
                }[];
                _meta?: Record<string, unknown> | null | undefined;
            }[];
        } & {
            type: "select";
        }) | ({
            currentValue: boolean;
        } & {
            type: "boolean";
        })) & {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            category?: string | null | undefined;
            description?: string | null | undefined;
        })[], ((({
            currentValue: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[] | {
                group: string;
                name: string;
                options: {
                    name: string;
                    value: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    description?: string | null | undefined;
                }[];
                _meta?: Record<string, unknown> | null | undefined;
            }[];
        } & {
            type: "select";
        }) | ({
            currentValue: boolean;
        } & {
            type: "boolean";
        })) & {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            category?: string | null | undefined;
            description?: string | null | undefined;
        })[]>>>>>;
        modes: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            availableModes: z.ZodType<{
                id: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[], {
                id: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[], z.core.$ZodTypeInternals<{
                id: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[], {
                id: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[]>>;
            currentModeId: z.ZodString;
        }, z.core.$strip>>>>;
        sessionId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        configOptions: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            currentValue: z.ZodString;
            options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$strip>>, z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                group: z.ZodString;
                name: z.ZodString;
                options: z.ZodArray<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    name: z.ZodString;
                    value: z.ZodString;
                }, z.core.$strip>>;
            }, z.core.$strip>>]>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"select">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            currentValue: z.ZodBoolean;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"boolean">;
        }, z.core.$strip>>]>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            category: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$strip>>>>, z.ZodTransform<((({
            currentValue: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[] | {
                group: string;
                name: string;
                options: {
                    name: string;
                    value: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    description?: string | null | undefined;
                }[];
                _meta?: Record<string, unknown> | null | undefined;
            }[];
        } & {
            type: "select";
        }) | ({
            currentValue: boolean;
        } & {
            type: "boolean";
        })) & {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            category?: string | null | undefined;
            description?: string | null | undefined;
        })[], ((({
            currentValue: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[] | {
                group: string;
                name: string;
                options: {
                    name: string;
                    value: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    description?: string | null | undefined;
                }[];
                _meta?: Record<string, unknown> | null | undefined;
            }[];
        } & {
            type: "select";
        }) | ({
            currentValue: boolean;
        } & {
            type: "boolean";
        })) & {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            category?: string | null | undefined;
            description?: string | null | undefined;
        })[]>>>>>;
        modes: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            availableModes: z.ZodType<{
                id: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[], {
                id: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[], z.core.$ZodTypeInternals<{
                id: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[], {
                id: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[]>>;
            currentModeId: z.ZodString;
        }, z.core.$strip>>>>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        nextCursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        sessions: z.ZodType<{
            cwd: string;
            sessionId: string;
            _meta?: Record<string, unknown> | null | undefined;
            additionalDirectories?: string[] | undefined;
            title?: string | null | undefined;
            updatedAt?: string | null | undefined;
        }[], {
            cwd: string;
            sessionId: string;
            _meta?: Record<string, unknown> | null | undefined;
            additionalDirectories?: string[] | undefined;
            title?: string | null | undefined;
            updatedAt?: string | null | undefined;
        }[], z.core.$ZodTypeInternals<{
            cwd: string;
            sessionId: string;
            _meta?: Record<string, unknown> | null | undefined;
            additionalDirectories?: string[] | undefined;
            title?: string | null | undefined;
            updatedAt?: string | null | undefined;
        }[], {
            cwd: string;
            sessionId: string;
            _meta?: Record<string, unknown> | null | undefined;
            additionalDirectories?: string[] | undefined;
            title?: string | null | undefined;
            updatedAt?: string | null | undefined;
        }[]>>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        configOptions: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            currentValue: z.ZodString;
            options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$strip>>, z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                group: z.ZodString;
                name: z.ZodString;
                options: z.ZodArray<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    name: z.ZodString;
                    value: z.ZodString;
                }, z.core.$strip>>;
            }, z.core.$strip>>]>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"select">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            currentValue: z.ZodBoolean;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"boolean">;
        }, z.core.$strip>>]>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            category: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$strip>>>>, z.ZodTransform<((({
            currentValue: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[] | {
                group: string;
                name: string;
                options: {
                    name: string;
                    value: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    description?: string | null | undefined;
                }[];
                _meta?: Record<string, unknown> | null | undefined;
            }[];
        } & {
            type: "select";
        }) | ({
            currentValue: boolean;
        } & {
            type: "boolean";
        })) & {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            category?: string | null | undefined;
            description?: string | null | undefined;
        })[], ((({
            currentValue: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[] | {
                group: string;
                name: string;
                options: {
                    name: string;
                    value: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    description?: string | null | undefined;
                }[];
                _meta?: Record<string, unknown> | null | undefined;
            }[];
        } & {
            type: "select";
        }) | ({
            currentValue: boolean;
        } & {
            type: "boolean";
        })) & {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            category?: string | null | undefined;
            description?: string | null | undefined;
        })[]>>>>>;
        modes: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            availableModes: z.ZodType<{
                id: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[], {
                id: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[], z.core.$ZodTypeInternals<{
                id: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[], {
                id: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[]>>;
            currentModeId: z.ZodString;
        }, z.core.$strip>>>>;
        sessionId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        configOptions: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            currentValue: z.ZodString;
            options: z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$strip>>, z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                group: z.ZodString;
                name: z.ZodString;
                options: z.ZodArray<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    name: z.ZodString;
                    value: z.ZodString;
                }, z.core.$strip>>;
            }, z.core.$strip>>]>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"select">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            currentValue: z.ZodBoolean;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"boolean">;
        }, z.core.$strip>>]>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            category: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"mode">, z.ZodLiteral<"model">, z.ZodLiteral<"thought_level">, z.ZodString]>>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$strip>>>>, z.ZodTransform<((({
            currentValue: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[] | {
                group: string;
                name: string;
                options: {
                    name: string;
                    value: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    description?: string | null | undefined;
                }[];
                _meta?: Record<string, unknown> | null | undefined;
            }[];
        } & {
            type: "select";
        }) | ({
            currentValue: boolean;
        } & {
            type: "boolean";
        })) & {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            category?: string | null | undefined;
            description?: string | null | undefined;
        })[], ((({
            currentValue: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[] | {
                group: string;
                name: string;
                options: {
                    name: string;
                    value: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    description?: string | null | undefined;
                }[];
                _meta?: Record<string, unknown> | null | undefined;
            }[];
        } & {
            type: "select";
        }) | ({
            currentValue: boolean;
        } & {
            type: "boolean";
        })) & {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            category?: string | null | undefined;
            description?: string | null | undefined;
        })[]>>>>>;
        modes: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            availableModes: z.ZodType<{
                id: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[], {
                id: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[], z.core.$ZodTypeInternals<{
                id: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[], {
                id: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[]>>;
            currentModeId: z.ZodString;
        }, z.core.$strip>>>>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        configOptions: z.ZodType<((({
            currentValue: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[] | {
                group: string;
                name: string;
                options: {
                    name: string;
                    value: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    description?: string | null | undefined;
                }[];
                _meta?: Record<string, unknown> | null | undefined;
            }[];
        } & {
            type: "select";
        }) | ({
            currentValue: boolean;
        } & {
            type: "boolean";
        })) & {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            category?: string | null | undefined;
            description?: string | null | undefined;
        })[], ((({
            currentValue: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[] | {
                group: string;
                name: string;
                options: {
                    name: string;
                    value: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    description?: string | null | undefined;
                }[];
                _meta?: Record<string, unknown> | null | undefined;
            }[];
        } & {
            type: "select";
        }) | ({
            currentValue: boolean;
        } & {
            type: "boolean";
        })) & {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            category?: string | null | undefined;
            description?: string | null | undefined;
        })[], z.core.$ZodTypeInternals<((({
            currentValue: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[] | {
                group: string;
                name: string;
                options: {
                    name: string;
                    value: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    description?: string | null | undefined;
                }[];
                _meta?: Record<string, unknown> | null | undefined;
            }[];
        } & {
            type: "select";
        }) | ({
            currentValue: boolean;
        } & {
            type: "boolean";
        })) & {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            category?: string | null | undefined;
            description?: string | null | undefined;
        })[], ((({
            currentValue: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[] | {
                group: string;
                name: string;
                options: {
                    name: string;
                    value: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    description?: string | null | undefined;
                }[];
                _meta?: Record<string, unknown> | null | undefined;
            }[];
        } & {
            type: "select";
        }) | ({
            currentValue: boolean;
        } & {
            type: "boolean";
        })) & {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            category?: string | null | undefined;
            description?: string | null | undefined;
        })[]>>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        stopReason: z.ZodUnion<readonly [z.ZodLiteral<"end_turn">, z.ZodLiteral<"max_tokens">, z.ZodLiteral<"max_turn_requests">, z.ZodLiteral<"refusal">, z.ZodLiteral<"cancelled">]>;
        usage: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            cachedReadTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            cachedWriteTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            inputTokens: z.ZodNumber;
            outputTokens: z.ZodNumber;
            thoughtTokens: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            totalTokens: z.ZodNumber;
        }, z.core.$strip>>>>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        sessionId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        suggestions: z.ZodType<(({
            edits: {
                newText: string;
                range: {
                    end: {
                        character: number;
                        line: number;
                    };
                    start: {
                        character: number;
                        line: number;
                    };
                };
            }[];
            id: string;
            uri: string;
            cursorPosition?: {
                character: number;
                line: number;
            } | null | undefined;
        } & {
            kind: "edit";
        }) | ({
            id: string;
            position: {
                character: number;
                line: number;
            };
            uri: string;
        } & {
            kind: "jump";
        }) | ({
            id: string;
            newName: string;
            position: {
                character: number;
                line: number;
            };
            uri: string;
        } & {
            kind: "rename";
        }) | ({
            id: string;
            replace: string;
            search: string;
            uri: string;
            isRegex?: boolean | null | undefined;
        } & {
            kind: "searchAndReplace";
        }))[], (({
            edits: {
                newText: string;
                range: {
                    end: {
                        character: number;
                        line: number;
                    };
                    start: {
                        character: number;
                        line: number;
                    };
                };
            }[];
            id: string;
            uri: string;
            cursorPosition?: {
                character: number;
                line: number;
            } | null | undefined;
        } & {
            kind: "edit";
        }) | ({
            id: string;
            position: {
                character: number;
                line: number;
            };
            uri: string;
        } & {
            kind: "jump";
        }) | ({
            id: string;
            newName: string;
            position: {
                character: number;
                line: number;
            };
            uri: string;
        } & {
            kind: "rename";
        }) | ({
            id: string;
            replace: string;
            search: string;
            uri: string;
            isRegex?: boolean | null | undefined;
        } & {
            kind: "searchAndReplace";
        }))[], z.core.$ZodTypeInternals<(({
            edits: {
                newText: string;
                range: {
                    end: {
                        character: number;
                        line: number;
                    };
                    start: {
                        character: number;
                        line: number;
                    };
                };
            }[];
            id: string;
            uri: string;
            cursorPosition?: {
                character: number;
                line: number;
            } | null | undefined;
        } & {
            kind: "edit";
        }) | ({
            id: string;
            position: {
                character: number;
                line: number;
            };
            uri: string;
        } & {
            kind: "jump";
        }) | ({
            id: string;
            newName: string;
            position: {
                character: number;
                line: number;
            };
            uri: string;
        } & {
            kind: "rename";
        }) | ({
            id: string;
            replace: string;
            search: string;
            uri: string;
            isRegex?: boolean | null | undefined;
        } & {
            kind: "searchAndReplace";
        }))[], (({
            edits: {
                newText: string;
                range: {
                    end: {
                        character: number;
                        line: number;
                    };
                    start: {
                        character: number;
                        line: number;
                    };
                };
            }[];
            id: string;
            uri: string;
            cursorPosition?: {
                character: number;
                line: number;
            } | null | undefined;
        } & {
            kind: "edit";
        }) | ({
            id: string;
            position: {
                character: number;
                line: number;
            };
            uri: string;
        } & {
            kind: "jump";
        }) | ({
            id: string;
            newName: string;
            position: {
                character: number;
                line: number;
            };
            uri: string;
        } & {
            kind: "rename";
        }) | ({
            id: string;
            replace: string;
            search: string;
            uri: string;
            isRegex?: boolean | null | undefined;
        } & {
            kind: "searchAndReplace";
        }))[]>>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>, z.ZodUnknown, z.ZodUnknown]>;
}, z.core.$strip>, z.ZodObject<{
    error: z.ZodObject<{
        code: z.ZodUnion<readonly [z.ZodLiteral<-32700>, z.ZodLiteral<-32600>, z.ZodLiteral<-32601>, z.ZodLiteral<-32602>, z.ZodLiteral<-32603>, z.ZodLiteral<-32800>, z.ZodLiteral<-32000>, z.ZodLiteral<-32002>, z.ZodLiteral<-32042>, z.ZodInt]>;
        data: z.ZodOptional<z.ZodUnknown>;
        message: z.ZodString;
    }, z.core.$strip>;
    id: z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
}, z.core.$strip>]>;
/**
 * Context window and cost update for a session.
 */
export declare const zUsageUpdate: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    cost: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        amount: z.ZodNumber;
        currency: z.ZodString;
    }, z.core.$strip>>>>;
    size: z.ZodNumber;
    used: z.ZodNumber;
}, z.core.$strip>;
/**
 * Different types of updates that can be sent during session processing.
 *
 * These updates provide real-time feedback about the agent's progress.
 *
 * See protocol docs: [Agent Reports Output](https://agentclientprotocol.com/protocol/prompt-turn#3-agent-reports-output)
 */
export declare const zSessionUpdate: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        text: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"text">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        uri: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"resource_link">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        resource: z.ZodUnion<readonly [z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            text: z.ZodString;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            blob: z.ZodString;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$strip>]>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
    }, z.core.$strip>>]>;
    messageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"user_message_chunk">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        text: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"text">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        uri: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"resource_link">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        resource: z.ZodUnion<readonly [z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            text: z.ZodString;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            blob: z.ZodString;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$strip>]>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
    }, z.core.$strip>>]>;
    messageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"agent_message_chunk">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        text: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"text">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
        uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        data: z.ZodString;
        mimeType: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        name: z.ZodString;
        size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        uri: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"resource_link">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                assistant: "assistant";
                user: "user";
            }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
            lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>>;
        resource: z.ZodUnion<readonly [z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            text: z.ZodString;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            blob: z.ZodString;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$strip>]>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
    }, z.core.$strip>>]>;
    messageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"agent_thought_chunk">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodCatch<z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            text: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"text">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"resource_link">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                blob: z.ZodString;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$strip>]>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
        }, z.core.$strip>>]>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"content">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        newText: z.ZodString;
        oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        path: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"diff">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        terminalId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"terminal">;
    }, z.core.$strip>>]>>>, z.ZodTransform<(({
        content: ({
            text: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "text";
        }) | ({
            data: string;
            mimeType: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
            uri?: string | null | undefined;
        } & {
            type: "image";
        }) | ({
            data: string;
            mimeType: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "audio";
        }) | ({
            name: string;
            uri: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
            description?: string | null | undefined;
            mimeType?: string | null | undefined;
            size?: number | null | undefined;
            title?: string | null | undefined;
        } & {
            type: "resource_link";
        }) | ({
            resource: {
                blob: string;
                uri: string;
                _meta?: Record<string, unknown> | null | undefined;
                mimeType?: string | null | undefined;
            } | {
                text: string;
                uri: string;
                _meta?: Record<string, unknown> | null | undefined;
                mimeType?: string | null | undefined;
            };
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "resource";
        });
        _meta?: Record<string, unknown> | null | undefined;
    } & {
        type: "content";
    }) | ({
        newText: string;
        path: string;
        _meta?: Record<string, unknown> | null | undefined;
        oldText?: string | null | undefined;
    } & {
        type: "diff";
    }) | ({
        terminalId: string;
        _meta?: Record<string, unknown> | null | undefined;
    } & {
        type: "terminal";
    }))[], (({
        content: ({
            text: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "text";
        }) | ({
            data: string;
            mimeType: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
            uri?: string | null | undefined;
        } & {
            type: "image";
        }) | ({
            data: string;
            mimeType: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "audio";
        }) | ({
            name: string;
            uri: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
            description?: string | null | undefined;
            mimeType?: string | null | undefined;
            size?: number | null | undefined;
            title?: string | null | undefined;
        } & {
            type: "resource_link";
        }) | ({
            resource: {
                blob: string;
                uri: string;
                _meta?: Record<string, unknown> | null | undefined;
                mimeType?: string | null | undefined;
            } | {
                text: string;
                uri: string;
                _meta?: Record<string, unknown> | null | undefined;
                mimeType?: string | null | undefined;
            };
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "resource";
        });
        _meta?: Record<string, unknown> | null | undefined;
    } & {
        type: "content";
    }) | ({
        newText: string;
        path: string;
        _meta?: Record<string, unknown> | null | undefined;
        oldText?: string | null | undefined;
    } & {
        type: "diff";
    }) | ({
        terminalId: string;
        _meta?: Record<string, unknown> | null | undefined;
    } & {
        type: "terminal";
    }))[]>>>>;
    kind: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"switch_mode">, z.ZodLiteral<"other">]>>;
    locations: z.ZodCatch<z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        line: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
        path: z.ZodString;
    }, z.core.$strip>>>, z.ZodTransform<{
        path: string;
        _meta?: Record<string, unknown> | null | undefined;
        line?: number | null | undefined;
    }[], {
        path: string;
        _meta?: Record<string, unknown> | null | undefined;
        line?: number | null | undefined;
    }[]>>>>;
    rawInput: z.ZodOptional<z.ZodUnknown>;
    rawOutput: z.ZodOptional<z.ZodUnknown>;
    status: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>>;
    title: z.ZodString;
    toolCallId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"tool_call">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            text: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"text">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"resource_link">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                blob: z.ZodString;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$strip>]>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
        }, z.core.$strip>>]>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"content">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        newText: z.ZodString;
        oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        path: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"diff">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        terminalId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"terminal">;
    }, z.core.$strip>>]>>>, z.ZodTransform<(({
        content: ({
            text: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "text";
        }) | ({
            data: string;
            mimeType: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
            uri?: string | null | undefined;
        } & {
            type: "image";
        }) | ({
            data: string;
            mimeType: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "audio";
        }) | ({
            name: string;
            uri: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
            description?: string | null | undefined;
            mimeType?: string | null | undefined;
            size?: number | null | undefined;
            title?: string | null | undefined;
        } & {
            type: "resource_link";
        }) | ({
            resource: {
                blob: string;
                uri: string;
                _meta?: Record<string, unknown> | null | undefined;
                mimeType?: string | null | undefined;
            } | {
                text: string;
                uri: string;
                _meta?: Record<string, unknown> | null | undefined;
                mimeType?: string | null | undefined;
            };
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "resource";
        });
        _meta?: Record<string, unknown> | null | undefined;
    } & {
        type: "content";
    }) | ({
        newText: string;
        path: string;
        _meta?: Record<string, unknown> | null | undefined;
        oldText?: string | null | undefined;
    } & {
        type: "diff";
    }) | ({
        terminalId: string;
        _meta?: Record<string, unknown> | null | undefined;
    } & {
        type: "terminal";
    }))[], (({
        content: ({
            text: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "text";
        }) | ({
            data: string;
            mimeType: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
            uri?: string | null | undefined;
        } & {
            type: "image";
        }) | ({
            data: string;
            mimeType: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "audio";
        }) | ({
            name: string;
            uri: string;
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
            description?: string | null | undefined;
            mimeType?: string | null | undefined;
            size?: number | null | undefined;
            title?: string | null | undefined;
        } & {
            type: "resource_link";
        }) | ({
            resource: {
                blob: string;
                uri: string;
                _meta?: Record<string, unknown> | null | undefined;
                mimeType?: string | null | undefined;
            } | {
                text: string;
                uri: string;
                _meta?: Record<string, unknown> | null | undefined;
                mimeType?: string | null | undefined;
            };
            _meta?: Record<string, unknown> | null | undefined;
            annotations?: {
                _meta?: Record<string, unknown> | null | undefined;
                audience?: ("assistant" | "user")[] | null | undefined;
                lastModified?: string | null | undefined;
                priority?: number | null | undefined;
            } | null | undefined;
        } & {
            type: "resource";
        });
        _meta?: Record<string, unknown> | null | undefined;
    } & {
        type: "content";
    }) | ({
        newText: string;
        path: string;
        _meta?: Record<string, unknown> | null | undefined;
        oldText?: string | null | undefined;
    } & {
        type: "diff";
    }) | ({
        terminalId: string;
        _meta?: Record<string, unknown> | null | undefined;
    } & {
        type: "terminal";
    }))[]>>>>>;
    kind: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"switch_mode">, z.ZodLiteral<"other">]>>>>;
    locations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        line: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
        path: z.ZodString;
    }, z.core.$strip>>>, z.ZodTransform<{
        path: string;
        _meta?: Record<string, unknown> | null | undefined;
        line?: number | null | undefined;
    }[], {
        path: string;
        _meta?: Record<string, unknown> | null | undefined;
        line?: number | null | undefined;
    }[]>>>>>;
    rawInput: z.ZodOptional<z.ZodUnknown>;
    rawOutput: z.ZodOptional<z.ZodUnknown>;
    status: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>>>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    toolCallId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"tool_call_update">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    entries: z.ZodType<{
        content: string;
        priority: "high" | "medium" | "low";
        status: "pending" | "in_progress" | "completed";
        _meta?: Record<string, unknown> | null | undefined;
    }[], {
        content: string;
        priority: "high" | "medium" | "low";
        status: "pending" | "in_progress" | "completed";
        _meta?: Record<string, unknown> | null | undefined;
    }[], z.core.$ZodTypeInternals<{
        content: string;
        priority: "high" | "medium" | "low";
        status: "pending" | "in_progress" | "completed";
        _meta?: Record<string, unknown> | null | undefined;
    }[], {
        content: string;
        priority: "high" | "medium" | "low";
        status: "pending" | "in_progress" | "completed";
        _meta?: Record<string, unknown> | null | undefined;
    }[]>>;
}, z.core.$strip>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"plan">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    plan: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        entries: z.ZodType<{
            content: string;
            priority: "high" | "medium" | "low";
            status: "pending" | "in_progress" | "completed";
            _meta?: Record<string, unknown> | null | undefined;
        }[], {
            content: string;
            priority: "high" | "medium" | "low";
            status: "pending" | "in_progress" | "completed";
            _meta?: Record<string, unknown> | null | undefined;
        }[], z.core.$ZodTypeInternals<{
            content: string;
            priority: "high" | "medium" | "low";
            status: "pending" | "in_progress" | "completed";
            _meta?: Record<string, unknown> | null | undefined;
        }[], {
            content: string;
            priority: "high" | "medium" | "low";
            status: "pending" | "in_progress" | "completed";
            _meta?: Record<string, unknown> | null | undefined;
        }[]>>;
        id: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"items">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        id: z.ZodString;
        uri: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"file">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"markdown">;
    }, z.core.$strip>>]>;
}, z.core.$strip>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"plan_update">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    id: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"plan_removed">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    availableCommands: z.ZodType<{
        description: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        input?: {
            hint: string;
            _meta?: Record<string, unknown> | null | undefined;
        } | null | undefined;
    }[], {
        description: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        input?: {
            hint: string;
            _meta?: Record<string, unknown> | null | undefined;
        } | null | undefined;
    }[], z.core.$ZodTypeInternals<{
        description: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        input?: {
            hint: string;
            _meta?: Record<string, unknown> | null | undefined;
        } | null | undefined;
    }[], {
        description: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        input?: {
            hint: string;
            _meta?: Record<string, unknown> | null | undefined;
        } | null | undefined;
    }[]>>;
}, z.core.$strip>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"available_commands_update">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    currentModeId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"current_mode_update">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    configOptions: z.ZodType<((({
        currentValue: string;
        options: {
            name: string;
            value: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[] | {
            group: string;
            name: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[];
            _meta?: Record<string, unknown> | null | undefined;
        }[];
    } & {
        type: "select";
    }) | ({
        currentValue: boolean;
    } & {
        type: "boolean";
    })) & {
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        category?: string | null | undefined;
        description?: string | null | undefined;
    })[], ((({
        currentValue: string;
        options: {
            name: string;
            value: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[] | {
            group: string;
            name: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[];
            _meta?: Record<string, unknown> | null | undefined;
        }[];
    } & {
        type: "select";
    }) | ({
        currentValue: boolean;
    } & {
        type: "boolean";
    })) & {
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        category?: string | null | undefined;
        description?: string | null | undefined;
    })[], z.core.$ZodTypeInternals<((({
        currentValue: string;
        options: {
            name: string;
            value: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[] | {
            group: string;
            name: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[];
            _meta?: Record<string, unknown> | null | undefined;
        }[];
    } & {
        type: "select";
    }) | ({
        currentValue: boolean;
    } & {
        type: "boolean";
    })) & {
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        category?: string | null | undefined;
        description?: string | null | undefined;
    })[], ((({
        currentValue: string;
        options: {
            name: string;
            value: string;
            _meta?: Record<string, unknown> | null | undefined;
            description?: string | null | undefined;
        }[] | {
            group: string;
            name: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[];
            _meta?: Record<string, unknown> | null | undefined;
        }[];
    } & {
        type: "select";
    }) | ({
        currentValue: boolean;
    } & {
        type: "boolean";
    })) & {
        id: string;
        name: string;
        _meta?: Record<string, unknown> | null | undefined;
        category?: string | null | undefined;
        description?: string | null | undefined;
    })[]>>;
}, z.core.$strip>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"config_option_update">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"session_info_update">;
}, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    cost: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        amount: z.ZodNumber;
        currency: z.ZodString;
    }, z.core.$strip>>>>;
    size: z.ZodNumber;
    used: z.ZodNumber;
}, z.core.$strip>, z.ZodObject<{
    sessionUpdate: z.ZodLiteral<"usage_update">;
}, z.core.$strip>>]>;
/**
 * Notification containing a session update from the agent.
 *
 * Used to stream real-time progress and results during prompt processing.
 *
 * See protocol docs: [Agent Reports Output](https://agentclientprotocol.com/protocol/prompt-turn#3-agent-reports-output)
 */
export declare const zSessionNotification: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    sessionId: z.ZodString;
    update: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            text: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"text">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"resource_link">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                blob: z.ZodString;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$strip>]>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
        }, z.core.$strip>>]>;
        messageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"user_message_chunk">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            text: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"text">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"resource_link">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                blob: z.ZodString;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$strip>]>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
        }, z.core.$strip>>]>;
        messageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"agent_message_chunk">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            text: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"text">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"resource_link">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                blob: z.ZodString;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$strip>]>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
        }, z.core.$strip>>]>;
        messageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"agent_thought_chunk">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodCatch<z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                text: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"text">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"resource_link">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                resource: z.ZodUnion<readonly [z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    text: z.ZodString;
                    uri: z.ZodString;
                }, z.core.$strip>, z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    blob: z.ZodString;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$strip>]>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"resource">;
            }, z.core.$strip>>]>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"content">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            newText: z.ZodString;
            oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            path: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"diff">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            terminalId: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"terminal">;
        }, z.core.$strip>>]>>>, z.ZodTransform<(({
            content: ({
                text: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
            } & {
                type: "text";
            }) | ({
                data: string;
                mimeType: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
                uri?: string | null | undefined;
            } & {
                type: "image";
            }) | ({
                data: string;
                mimeType: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
            } & {
                type: "audio";
            }) | ({
                name: string;
                uri: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
                description?: string | null | undefined;
                mimeType?: string | null | undefined;
                size?: number | null | undefined;
                title?: string | null | undefined;
            } & {
                type: "resource_link";
            }) | ({
                resource: {
                    blob: string;
                    uri: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    mimeType?: string | null | undefined;
                } | {
                    text: string;
                    uri: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    mimeType?: string | null | undefined;
                };
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
            } & {
                type: "resource";
            });
            _meta?: Record<string, unknown> | null | undefined;
        } & {
            type: "content";
        }) | ({
            newText: string;
            path: string;
            _meta?: Record<string, unknown> | null | undefined;
            oldText?: string | null | undefined;
        } & {
            type: "diff";
        }) | ({
            terminalId: string;
            _meta?: Record<string, unknown> | null | undefined;
        } & {
            type: "terminal";
        }))[], (({
            content: ({
                text: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
            } & {
                type: "text";
            }) | ({
                data: string;
                mimeType: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
                uri?: string | null | undefined;
            } & {
                type: "image";
            }) | ({
                data: string;
                mimeType: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
            } & {
                type: "audio";
            }) | ({
                name: string;
                uri: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
                description?: string | null | undefined;
                mimeType?: string | null | undefined;
                size?: number | null | undefined;
                title?: string | null | undefined;
            } & {
                type: "resource_link";
            }) | ({
                resource: {
                    blob: string;
                    uri: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    mimeType?: string | null | undefined;
                } | {
                    text: string;
                    uri: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    mimeType?: string | null | undefined;
                };
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
            } & {
                type: "resource";
            });
            _meta?: Record<string, unknown> | null | undefined;
        } & {
            type: "content";
        }) | ({
            newText: string;
            path: string;
            _meta?: Record<string, unknown> | null | undefined;
            oldText?: string | null | undefined;
        } & {
            type: "diff";
        }) | ({
            terminalId: string;
            _meta?: Record<string, unknown> | null | undefined;
        } & {
            type: "terminal";
        }))[]>>>>;
        kind: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"switch_mode">, z.ZodLiteral<"other">]>>;
        locations: z.ZodCatch<z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            line: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
            path: z.ZodString;
        }, z.core.$strip>>>, z.ZodTransform<{
            path: string;
            _meta?: Record<string, unknown> | null | undefined;
            line?: number | null | undefined;
        }[], {
            path: string;
            _meta?: Record<string, unknown> | null | undefined;
            line?: number | null | undefined;
        }[]>>>>;
        rawInput: z.ZodOptional<z.ZodUnknown>;
        rawOutput: z.ZodOptional<z.ZodUnknown>;
        status: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>>;
        title: z.ZodString;
        toolCallId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"tool_call">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                text: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"text">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"resource_link">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                resource: z.ZodUnion<readonly [z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    text: z.ZodString;
                    uri: z.ZodString;
                }, z.core.$strip>, z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    blob: z.ZodString;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$strip>]>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"resource">;
            }, z.core.$strip>>]>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"content">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            newText: z.ZodString;
            oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            path: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"diff">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            terminalId: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"terminal">;
        }, z.core.$strip>>]>>>, z.ZodTransform<(({
            content: ({
                text: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
            } & {
                type: "text";
            }) | ({
                data: string;
                mimeType: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
                uri?: string | null | undefined;
            } & {
                type: "image";
            }) | ({
                data: string;
                mimeType: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
            } & {
                type: "audio";
            }) | ({
                name: string;
                uri: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
                description?: string | null | undefined;
                mimeType?: string | null | undefined;
                size?: number | null | undefined;
                title?: string | null | undefined;
            } & {
                type: "resource_link";
            }) | ({
                resource: {
                    blob: string;
                    uri: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    mimeType?: string | null | undefined;
                } | {
                    text: string;
                    uri: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    mimeType?: string | null | undefined;
                };
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
            } & {
                type: "resource";
            });
            _meta?: Record<string, unknown> | null | undefined;
        } & {
            type: "content";
        }) | ({
            newText: string;
            path: string;
            _meta?: Record<string, unknown> | null | undefined;
            oldText?: string | null | undefined;
        } & {
            type: "diff";
        }) | ({
            terminalId: string;
            _meta?: Record<string, unknown> | null | undefined;
        } & {
            type: "terminal";
        }))[], (({
            content: ({
                text: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
            } & {
                type: "text";
            }) | ({
                data: string;
                mimeType: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
                uri?: string | null | undefined;
            } & {
                type: "image";
            }) | ({
                data: string;
                mimeType: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
            } & {
                type: "audio";
            }) | ({
                name: string;
                uri: string;
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
                description?: string | null | undefined;
                mimeType?: string | null | undefined;
                size?: number | null | undefined;
                title?: string | null | undefined;
            } & {
                type: "resource_link";
            }) | ({
                resource: {
                    blob: string;
                    uri: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    mimeType?: string | null | undefined;
                } | {
                    text: string;
                    uri: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    mimeType?: string | null | undefined;
                };
                _meta?: Record<string, unknown> | null | undefined;
                annotations?: {
                    _meta?: Record<string, unknown> | null | undefined;
                    audience?: ("assistant" | "user")[] | null | undefined;
                    lastModified?: string | null | undefined;
                    priority?: number | null | undefined;
                } | null | undefined;
            } & {
                type: "resource";
            });
            _meta?: Record<string, unknown> | null | undefined;
        } & {
            type: "content";
        }) | ({
            newText: string;
            path: string;
            _meta?: Record<string, unknown> | null | undefined;
            oldText?: string | null | undefined;
        } & {
            type: "diff";
        }) | ({
            terminalId: string;
            _meta?: Record<string, unknown> | null | undefined;
        } & {
            type: "terminal";
        }))[]>>>>>;
        kind: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"switch_mode">, z.ZodLiteral<"other">]>>>>;
        locations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            line: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
            path: z.ZodString;
        }, z.core.$strip>>>, z.ZodTransform<{
            path: string;
            _meta?: Record<string, unknown> | null | undefined;
            line?: number | null | undefined;
        }[], {
            path: string;
            _meta?: Record<string, unknown> | null | undefined;
            line?: number | null | undefined;
        }[]>>>>>;
        rawInput: z.ZodOptional<z.ZodUnknown>;
        rawOutput: z.ZodOptional<z.ZodUnknown>;
        status: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>>>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        toolCallId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"tool_call_update">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        entries: z.ZodType<{
            content: string;
            priority: "high" | "medium" | "low";
            status: "pending" | "in_progress" | "completed";
            _meta?: Record<string, unknown> | null | undefined;
        }[], {
            content: string;
            priority: "high" | "medium" | "low";
            status: "pending" | "in_progress" | "completed";
            _meta?: Record<string, unknown> | null | undefined;
        }[], z.core.$ZodTypeInternals<{
            content: string;
            priority: "high" | "medium" | "low";
            status: "pending" | "in_progress" | "completed";
            _meta?: Record<string, unknown> | null | undefined;
        }[], {
            content: string;
            priority: "high" | "medium" | "low";
            status: "pending" | "in_progress" | "completed";
            _meta?: Record<string, unknown> | null | undefined;
        }[]>>;
    }, z.core.$strip>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"plan">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        plan: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            entries: z.ZodType<{
                content: string;
                priority: "high" | "medium" | "low";
                status: "pending" | "in_progress" | "completed";
                _meta?: Record<string, unknown> | null | undefined;
            }[], {
                content: string;
                priority: "high" | "medium" | "low";
                status: "pending" | "in_progress" | "completed";
                _meta?: Record<string, unknown> | null | undefined;
            }[], z.core.$ZodTypeInternals<{
                content: string;
                priority: "high" | "medium" | "low";
                status: "pending" | "in_progress" | "completed";
                _meta?: Record<string, unknown> | null | undefined;
            }[], {
                content: string;
                priority: "high" | "medium" | "low";
                status: "pending" | "in_progress" | "completed";
                _meta?: Record<string, unknown> | null | undefined;
            }[]>>;
            id: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"items">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            id: z.ZodString;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"file">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            content: z.ZodString;
            id: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"markdown">;
        }, z.core.$strip>>]>;
    }, z.core.$strip>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"plan_update">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        id: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"plan_removed">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        availableCommands: z.ZodType<{
            description: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            input?: {
                hint: string;
                _meta?: Record<string, unknown> | null | undefined;
            } | null | undefined;
        }[], {
            description: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            input?: {
                hint: string;
                _meta?: Record<string, unknown> | null | undefined;
            } | null | undefined;
        }[], z.core.$ZodTypeInternals<{
            description: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            input?: {
                hint: string;
                _meta?: Record<string, unknown> | null | undefined;
            } | null | undefined;
        }[], {
            description: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            input?: {
                hint: string;
                _meta?: Record<string, unknown> | null | undefined;
            } | null | undefined;
        }[]>>;
    }, z.core.$strip>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"available_commands_update">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        currentModeId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"current_mode_update">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        configOptions: z.ZodType<((({
            currentValue: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[] | {
                group: string;
                name: string;
                options: {
                    name: string;
                    value: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    description?: string | null | undefined;
                }[];
                _meta?: Record<string, unknown> | null | undefined;
            }[];
        } & {
            type: "select";
        }) | ({
            currentValue: boolean;
        } & {
            type: "boolean";
        })) & {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            category?: string | null | undefined;
            description?: string | null | undefined;
        })[], ((({
            currentValue: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[] | {
                group: string;
                name: string;
                options: {
                    name: string;
                    value: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    description?: string | null | undefined;
                }[];
                _meta?: Record<string, unknown> | null | undefined;
            }[];
        } & {
            type: "select";
        }) | ({
            currentValue: boolean;
        } & {
            type: "boolean";
        })) & {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            category?: string | null | undefined;
            description?: string | null | undefined;
        })[], z.core.$ZodTypeInternals<((({
            currentValue: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[] | {
                group: string;
                name: string;
                options: {
                    name: string;
                    value: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    description?: string | null | undefined;
                }[];
                _meta?: Record<string, unknown> | null | undefined;
            }[];
        } & {
            type: "select";
        }) | ({
            currentValue: boolean;
        } & {
            type: "boolean";
        })) & {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            category?: string | null | undefined;
            description?: string | null | undefined;
        })[], ((({
            currentValue: string;
            options: {
                name: string;
                value: string;
                _meta?: Record<string, unknown> | null | undefined;
                description?: string | null | undefined;
            }[] | {
                group: string;
                name: string;
                options: {
                    name: string;
                    value: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    description?: string | null | undefined;
                }[];
                _meta?: Record<string, unknown> | null | undefined;
            }[];
        } & {
            type: "select";
        }) | ({
            currentValue: boolean;
        } & {
            type: "boolean";
        })) & {
            id: string;
            name: string;
            _meta?: Record<string, unknown> | null | undefined;
            category?: string | null | undefined;
            description?: string | null | undefined;
        })[]>>;
    }, z.core.$strip>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"config_option_update">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        updatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"session_info_update">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        cost: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            amount: z.ZodNumber;
            currency: z.ZodString;
        }, z.core.$strip>>>>;
        size: z.ZodNumber;
        used: z.ZodNumber;
    }, z.core.$strip>, z.ZodObject<{
        sessionUpdate: z.ZodLiteral<"usage_update">;
    }, z.core.$strip>>]>;
}, z.core.$strip>;
export declare const zAgentNotification: z.ZodObject<{
    method: z.ZodString;
    params: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        sessionId: z.ZodString;
        update: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                text: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"text">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"resource_link">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                resource: z.ZodUnion<readonly [z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    text: z.ZodString;
                    uri: z.ZodString;
                }, z.core.$strip>, z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    blob: z.ZodString;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$strip>]>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"resource">;
            }, z.core.$strip>>]>;
            messageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"user_message_chunk">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                text: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"text">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"resource_link">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                resource: z.ZodUnion<readonly [z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    text: z.ZodString;
                    uri: z.ZodString;
                }, z.core.$strip>, z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    blob: z.ZodString;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$strip>]>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"resource">;
            }, z.core.$strip>>]>;
            messageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"agent_message_chunk">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                text: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"text">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
                uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"image">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                data: z.ZodString;
                mimeType: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"audio">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                name: z.ZodString;
                size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"resource_link">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                        assistant: "assistant";
                        user: "user";
                    }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                    lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                }, z.core.$strip>>>>;
                resource: z.ZodUnion<readonly [z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    text: z.ZodString;
                    uri: z.ZodString;
                }, z.core.$strip>, z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    blob: z.ZodString;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$strip>]>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"resource">;
            }, z.core.$strip>>]>;
            messageId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"agent_thought_chunk">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            content: z.ZodCatch<z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$strip>>>>;
                    text: z.ZodString;
                }, z.core.$strip>, z.ZodObject<{
                    type: z.ZodLiteral<"text">;
                }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$strip>>>>;
                    data: z.ZodString;
                    mimeType: z.ZodString;
                    uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                }, z.core.$strip>, z.ZodObject<{
                    type: z.ZodLiteral<"image">;
                }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$strip>>>>;
                    data: z.ZodString;
                    mimeType: z.ZodString;
                }, z.core.$strip>, z.ZodObject<{
                    type: z.ZodLiteral<"audio">;
                }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$strip>>>>;
                    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    name: z.ZodString;
                    size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$strip>, z.ZodObject<{
                    type: z.ZodLiteral<"resource_link">;
                }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$strip>>>>;
                    resource: z.ZodUnion<readonly [z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        text: z.ZodString;
                        uri: z.ZodString;
                    }, z.core.$strip>, z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        blob: z.ZodString;
                        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        uri: z.ZodString;
                    }, z.core.$strip>]>;
                }, z.core.$strip>, z.ZodObject<{
                    type: z.ZodLiteral<"resource">;
                }, z.core.$strip>>]>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"content">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                newText: z.ZodString;
                oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                path: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"diff">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                terminalId: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"terminal">;
            }, z.core.$strip>>]>>>, z.ZodTransform<(({
                content: ({
                    text: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                } & {
                    type: "text";
                }) | ({
                    data: string;
                    mimeType: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                    uri?: string | null | undefined;
                } & {
                    type: "image";
                }) | ({
                    data: string;
                    mimeType: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                } & {
                    type: "audio";
                }) | ({
                    name: string;
                    uri: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                    description?: string | null | undefined;
                    mimeType?: string | null | undefined;
                    size?: number | null | undefined;
                    title?: string | null | undefined;
                } & {
                    type: "resource_link";
                }) | ({
                    resource: {
                        blob: string;
                        uri: string;
                        _meta?: Record<string, unknown> | null | undefined;
                        mimeType?: string | null | undefined;
                    } | {
                        text: string;
                        uri: string;
                        _meta?: Record<string, unknown> | null | undefined;
                        mimeType?: string | null | undefined;
                    };
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                } & {
                    type: "resource";
                });
                _meta?: Record<string, unknown> | null | undefined;
            } & {
                type: "content";
            }) | ({
                newText: string;
                path: string;
                _meta?: Record<string, unknown> | null | undefined;
                oldText?: string | null | undefined;
            } & {
                type: "diff";
            }) | ({
                terminalId: string;
                _meta?: Record<string, unknown> | null | undefined;
            } & {
                type: "terminal";
            }))[], (({
                content: ({
                    text: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                } & {
                    type: "text";
                }) | ({
                    data: string;
                    mimeType: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                    uri?: string | null | undefined;
                } & {
                    type: "image";
                }) | ({
                    data: string;
                    mimeType: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                } & {
                    type: "audio";
                }) | ({
                    name: string;
                    uri: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                    description?: string | null | undefined;
                    mimeType?: string | null | undefined;
                    size?: number | null | undefined;
                    title?: string | null | undefined;
                } & {
                    type: "resource_link";
                }) | ({
                    resource: {
                        blob: string;
                        uri: string;
                        _meta?: Record<string, unknown> | null | undefined;
                        mimeType?: string | null | undefined;
                    } | {
                        text: string;
                        uri: string;
                        _meta?: Record<string, unknown> | null | undefined;
                        mimeType?: string | null | undefined;
                    };
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                } & {
                    type: "resource";
                });
                _meta?: Record<string, unknown> | null | undefined;
            } & {
                type: "content";
            }) | ({
                newText: string;
                path: string;
                _meta?: Record<string, unknown> | null | undefined;
                oldText?: string | null | undefined;
            } & {
                type: "diff";
            }) | ({
                terminalId: string;
                _meta?: Record<string, unknown> | null | undefined;
            } & {
                type: "terminal";
            }))[]>>>>;
            kind: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"switch_mode">, z.ZodLiteral<"other">]>>;
            locations: z.ZodCatch<z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                line: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
                path: z.ZodString;
            }, z.core.$strip>>>, z.ZodTransform<{
                path: string;
                _meta?: Record<string, unknown> | null | undefined;
                line?: number | null | undefined;
            }[], {
                path: string;
                _meta?: Record<string, unknown> | null | undefined;
                line?: number | null | undefined;
            }[]>>>>;
            rawInput: z.ZodOptional<z.ZodUnknown>;
            rawOutput: z.ZodOptional<z.ZodUnknown>;
            status: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>>;
            title: z.ZodString;
            toolCallId: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"tool_call">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            content: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$strip>>>>;
                    text: z.ZodString;
                }, z.core.$strip>, z.ZodObject<{
                    type: z.ZodLiteral<"text">;
                }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$strip>>>>;
                    data: z.ZodString;
                    mimeType: z.ZodString;
                    uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                }, z.core.$strip>, z.ZodObject<{
                    type: z.ZodLiteral<"image">;
                }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$strip>>>>;
                    data: z.ZodString;
                    mimeType: z.ZodString;
                }, z.core.$strip>, z.ZodObject<{
                    type: z.ZodLiteral<"audio">;
                }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$strip>>>>;
                    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    name: z.ZodString;
                    size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$strip>, z.ZodObject<{
                    type: z.ZodLiteral<"resource_link">;
                }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$strip>>>>;
                    resource: z.ZodUnion<readonly [z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        text: z.ZodString;
                        uri: z.ZodString;
                    }, z.core.$strip>, z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        blob: z.ZodString;
                        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        uri: z.ZodString;
                    }, z.core.$strip>]>;
                }, z.core.$strip>, z.ZodObject<{
                    type: z.ZodLiteral<"resource">;
                }, z.core.$strip>>]>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"content">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                newText: z.ZodString;
                oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                path: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"diff">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                terminalId: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"terminal">;
            }, z.core.$strip>>]>>>, z.ZodTransform<(({
                content: ({
                    text: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                } & {
                    type: "text";
                }) | ({
                    data: string;
                    mimeType: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                    uri?: string | null | undefined;
                } & {
                    type: "image";
                }) | ({
                    data: string;
                    mimeType: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                } & {
                    type: "audio";
                }) | ({
                    name: string;
                    uri: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                    description?: string | null | undefined;
                    mimeType?: string | null | undefined;
                    size?: number | null | undefined;
                    title?: string | null | undefined;
                } & {
                    type: "resource_link";
                }) | ({
                    resource: {
                        blob: string;
                        uri: string;
                        _meta?: Record<string, unknown> | null | undefined;
                        mimeType?: string | null | undefined;
                    } | {
                        text: string;
                        uri: string;
                        _meta?: Record<string, unknown> | null | undefined;
                        mimeType?: string | null | undefined;
                    };
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                } & {
                    type: "resource";
                });
                _meta?: Record<string, unknown> | null | undefined;
            } & {
                type: "content";
            }) | ({
                newText: string;
                path: string;
                _meta?: Record<string, unknown> | null | undefined;
                oldText?: string | null | undefined;
            } & {
                type: "diff";
            }) | ({
                terminalId: string;
                _meta?: Record<string, unknown> | null | undefined;
            } & {
                type: "terminal";
            }))[], (({
                content: ({
                    text: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                } & {
                    type: "text";
                }) | ({
                    data: string;
                    mimeType: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                    uri?: string | null | undefined;
                } & {
                    type: "image";
                }) | ({
                    data: string;
                    mimeType: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                } & {
                    type: "audio";
                }) | ({
                    name: string;
                    uri: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                    description?: string | null | undefined;
                    mimeType?: string | null | undefined;
                    size?: number | null | undefined;
                    title?: string | null | undefined;
                } & {
                    type: "resource_link";
                }) | ({
                    resource: {
                        blob: string;
                        uri: string;
                        _meta?: Record<string, unknown> | null | undefined;
                        mimeType?: string | null | undefined;
                    } | {
                        text: string;
                        uri: string;
                        _meta?: Record<string, unknown> | null | undefined;
                        mimeType?: string | null | undefined;
                    };
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                } & {
                    type: "resource";
                });
                _meta?: Record<string, unknown> | null | undefined;
            } & {
                type: "content";
            }) | ({
                newText: string;
                path: string;
                _meta?: Record<string, unknown> | null | undefined;
                oldText?: string | null | undefined;
            } & {
                type: "diff";
            }) | ({
                terminalId: string;
                _meta?: Record<string, unknown> | null | undefined;
            } & {
                type: "terminal";
            }))[]>>>>>;
            kind: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"switch_mode">, z.ZodLiteral<"other">]>>>>;
            locations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                line: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
                path: z.ZodString;
            }, z.core.$strip>>>, z.ZodTransform<{
                path: string;
                _meta?: Record<string, unknown> | null | undefined;
                line?: number | null | undefined;
            }[], {
                path: string;
                _meta?: Record<string, unknown> | null | undefined;
                line?: number | null | undefined;
            }[]>>>>>;
            rawInput: z.ZodOptional<z.ZodUnknown>;
            rawOutput: z.ZodOptional<z.ZodUnknown>;
            status: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>>>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            toolCallId: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"tool_call_update">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            entries: z.ZodType<{
                content: string;
                priority: "high" | "medium" | "low";
                status: "pending" | "in_progress" | "completed";
                _meta?: Record<string, unknown> | null | undefined;
            }[], {
                content: string;
                priority: "high" | "medium" | "low";
                status: "pending" | "in_progress" | "completed";
                _meta?: Record<string, unknown> | null | undefined;
            }[], z.core.$ZodTypeInternals<{
                content: string;
                priority: "high" | "medium" | "low";
                status: "pending" | "in_progress" | "completed";
                _meta?: Record<string, unknown> | null | undefined;
            }[], {
                content: string;
                priority: "high" | "medium" | "low";
                status: "pending" | "in_progress" | "completed";
                _meta?: Record<string, unknown> | null | undefined;
            }[]>>;
        }, z.core.$strip>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"plan">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            plan: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                entries: z.ZodType<{
                    content: string;
                    priority: "high" | "medium" | "low";
                    status: "pending" | "in_progress" | "completed";
                    _meta?: Record<string, unknown> | null | undefined;
                }[], {
                    content: string;
                    priority: "high" | "medium" | "low";
                    status: "pending" | "in_progress" | "completed";
                    _meta?: Record<string, unknown> | null | undefined;
                }[], z.core.$ZodTypeInternals<{
                    content: string;
                    priority: "high" | "medium" | "low";
                    status: "pending" | "in_progress" | "completed";
                    _meta?: Record<string, unknown> | null | undefined;
                }[], {
                    content: string;
                    priority: "high" | "medium" | "low";
                    status: "pending" | "in_progress" | "completed";
                    _meta?: Record<string, unknown> | null | undefined;
                }[]>>;
                id: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"items">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                id: z.ZodString;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"file">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                content: z.ZodString;
                id: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"markdown">;
            }, z.core.$strip>>]>;
        }, z.core.$strip>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"plan_update">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            id: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"plan_removed">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            availableCommands: z.ZodType<{
                description: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                input?: {
                    hint: string;
                    _meta?: Record<string, unknown> | null | undefined;
                } | null | undefined;
            }[], {
                description: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                input?: {
                    hint: string;
                    _meta?: Record<string, unknown> | null | undefined;
                } | null | undefined;
            }[], z.core.$ZodTypeInternals<{
                description: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                input?: {
                    hint: string;
                    _meta?: Record<string, unknown> | null | undefined;
                } | null | undefined;
            }[], {
                description: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                input?: {
                    hint: string;
                    _meta?: Record<string, unknown> | null | undefined;
                } | null | undefined;
            }[]>>;
        }, z.core.$strip>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"available_commands_update">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            currentModeId: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"current_mode_update">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            configOptions: z.ZodType<((({
                currentValue: string;
                options: {
                    name: string;
                    value: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    description?: string | null | undefined;
                }[] | {
                    group: string;
                    name: string;
                    options: {
                        name: string;
                        value: string;
                        _meta?: Record<string, unknown> | null | undefined;
                        description?: string | null | undefined;
                    }[];
                    _meta?: Record<string, unknown> | null | undefined;
                }[];
            } & {
                type: "select";
            }) | ({
                currentValue: boolean;
            } & {
                type: "boolean";
            })) & {
                id: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                category?: string | null | undefined;
                description?: string | null | undefined;
            })[], ((({
                currentValue: string;
                options: {
                    name: string;
                    value: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    description?: string | null | undefined;
                }[] | {
                    group: string;
                    name: string;
                    options: {
                        name: string;
                        value: string;
                        _meta?: Record<string, unknown> | null | undefined;
                        description?: string | null | undefined;
                    }[];
                    _meta?: Record<string, unknown> | null | undefined;
                }[];
            } & {
                type: "select";
            }) | ({
                currentValue: boolean;
            } & {
                type: "boolean";
            })) & {
                id: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                category?: string | null | undefined;
                description?: string | null | undefined;
            })[], z.core.$ZodTypeInternals<((({
                currentValue: string;
                options: {
                    name: string;
                    value: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    description?: string | null | undefined;
                }[] | {
                    group: string;
                    name: string;
                    options: {
                        name: string;
                        value: string;
                        _meta?: Record<string, unknown> | null | undefined;
                        description?: string | null | undefined;
                    }[];
                    _meta?: Record<string, unknown> | null | undefined;
                }[];
            } & {
                type: "select";
            }) | ({
                currentValue: boolean;
            } & {
                type: "boolean";
            })) & {
                id: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                category?: string | null | undefined;
                description?: string | null | undefined;
            })[], ((({
                currentValue: string;
                options: {
                    name: string;
                    value: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    description?: string | null | undefined;
                }[] | {
                    group: string;
                    name: string;
                    options: {
                        name: string;
                        value: string;
                        _meta?: Record<string, unknown> | null | undefined;
                        description?: string | null | undefined;
                    }[];
                    _meta?: Record<string, unknown> | null | undefined;
                }[];
            } & {
                type: "select";
            }) | ({
                currentValue: boolean;
            } & {
                type: "boolean";
            })) & {
                id: string;
                name: string;
                _meta?: Record<string, unknown> | null | undefined;
                category?: string | null | undefined;
                description?: string | null | undefined;
            })[]>>;
        }, z.core.$strip>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"config_option_update">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            updatedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"session_info_update">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            cost: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                amount: z.ZodNumber;
                currency: z.ZodString;
            }, z.core.$strip>>>>;
            size: z.ZodNumber;
            used: z.ZodNumber;
        }, z.core.$strip>, z.ZodObject<{
            sessionUpdate: z.ZodLiteral<"usage_update">;
        }, z.core.$strip>>]>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        elicitationId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        connectionId: z.ZodString;
        method: z.ZodString;
        params: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>, z.ZodUnknown]>>>;
}, z.core.$strip>;
/**
 * Request to wait for a terminal command to exit.
 */
export declare const zWaitForTerminalExitRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    sessionId: z.ZodString;
    terminalId: z.ZodString;
}, z.core.$strip>;
/**
 * Response containing the exit status of a terminal command.
 */
export declare const zWaitForTerminalExitResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    exitCode: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
    signal: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/**
 * A workspace folder.
 */
export declare const zWorkspaceFolder: z.ZodObject<{
    name: z.ZodString;
    uri: z.ZodString;
}, z.core.$strip>;
/**
 * Request to start an NES session.
 */
export declare const zStartNesRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    repository: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
        name: z.ZodString;
        owner: z.ZodString;
        remoteUrl: z.ZodString;
    }, z.core.$strip>>>>;
    workspaceFolders: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
        name: z.ZodString;
        uri: z.ZodString;
    }, z.core.$strip>>>, z.ZodTransform<{
        name: string;
        uri: string;
    }[], {
        name: string;
        uri: string;
    }[]>>>>>;
    workspaceUri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const zClientRequest: z.ZodObject<{
    id: z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    method: z.ZodString;
    params: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        clientCapabilities: z.ZodDefault<z.ZodOptional<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            auth: z.ZodDefault<z.ZodOptional<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                terminal: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            }, z.core.$strip>>>;
            elicitation: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                form: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$strip>>>>;
                url: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$strip>>>>;
            }, z.core.$strip>>>>;
            fs: z.ZodDefault<z.ZodOptional<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                readTextFile: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                writeTextFile: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
            }, z.core.$strip>>>;
            nes: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                jump: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$strip>>>>;
                rename: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$strip>>>>;
                searchAndReplace: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                }, z.core.$strip>>>>;
            }, z.core.$strip>>>>;
            plan: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            }, z.core.$strip>>>>;
            positionEncodings: z.ZodCatch<z.ZodOptional<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodUnion<readonly [z.ZodLiteral<"utf-16">, z.ZodLiteral<"utf-32">, z.ZodLiteral<"utf-8">]>>>, z.ZodTransform<("utf-16" | "utf-32" | "utf-8")[], ("utf-16" | "utf-32" | "utf-8")[]>>>>;
            terminal: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, z.core.$strip>>>;
        clientInfo: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            version: z.ZodString;
        }, z.core.$strip>>>>;
        protocolVersion: z.ZodInt;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        methodId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        apiType: z.ZodUnion<readonly [z.ZodLiteral<"anthropic">, z.ZodLiteral<"openai">, z.ZodLiteral<"azure">, z.ZodLiteral<"vertex">, z.ZodLiteral<"bedrock">, z.ZodString]>;
        baseUrl: z.ZodString;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        id: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        id: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        additionalDirectories: z.ZodOptional<z.ZodArray<z.ZodString>>;
        cwd: z.ZodString;
        mcpServers: z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            headers: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$strip>>;
            name: z.ZodString;
            url: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"http">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            headers: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$strip>>;
            name: z.ZodString;
            url: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"sse">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"acp">;
        }, z.core.$strip>>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            args: z.ZodArray<z.ZodString>;
            command: z.ZodString;
            env: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$strip>>;
            name: z.ZodString;
        }, z.core.$strip>]>>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        additionalDirectories: z.ZodOptional<z.ZodArray<z.ZodString>>;
        cwd: z.ZodString;
        mcpServers: z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            headers: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$strip>>;
            name: z.ZodString;
            url: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"http">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            headers: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$strip>>;
            name: z.ZodString;
            url: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"sse">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"acp">;
        }, z.core.$strip>>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            args: z.ZodArray<z.ZodString>;
            command: z.ZodString;
            env: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$strip>>;
            name: z.ZodString;
        }, z.core.$strip>]>>;
        sessionId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        cursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        cwd: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        sessionId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        additionalDirectories: z.ZodOptional<z.ZodArray<z.ZodString>>;
        cwd: z.ZodString;
        mcpServers: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            headers: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$strip>>;
            name: z.ZodString;
            url: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"http">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            headers: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$strip>>;
            name: z.ZodString;
            url: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"sse">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"acp">;
        }, z.core.$strip>>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            args: z.ZodArray<z.ZodString>;
            command: z.ZodString;
            env: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$strip>>;
            name: z.ZodString;
        }, z.core.$strip>]>>>;
        sessionId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        additionalDirectories: z.ZodOptional<z.ZodArray<z.ZodString>>;
        cwd: z.ZodString;
        mcpServers: z.ZodOptional<z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            headers: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$strip>>;
            name: z.ZodString;
            url: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"http">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            headers: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$strip>>;
            name: z.ZodString;
            url: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"sse">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            id: z.ZodString;
            name: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"acp">;
        }, z.core.$strip>>, z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            args: z.ZodArray<z.ZodString>;
            command: z.ZodString;
            env: z.ZodArray<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                name: z.ZodString;
                value: z.ZodString;
            }, z.core.$strip>>;
            name: z.ZodString;
        }, z.core.$strip>]>>>;
        sessionId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        sessionId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        modeId: z.ZodString;
        sessionId: z.ZodString;
    }, z.core.$strip>, z.ZodIntersection<z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<"boolean">;
        value: z.ZodBoolean;
    }, z.core.$strip>, z.ZodObject<{
        value: z.ZodString;
    }, z.core.$strip>]>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        configId: z.ZodString;
        sessionId: z.ZodString;
    }, z.core.$strip>>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        prompt: z.ZodArray<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            text: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"text">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
            uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"image">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            data: z.ZodString;
            mimeType: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"audio">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            name: z.ZodString;
            size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            uri: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"resource_link">;
        }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                    assistant: "assistant";
                    user: "user";
                }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>>>;
            resource: z.ZodUnion<readonly [z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                blob: z.ZodString;
                mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                uri: z.ZodString;
            }, z.core.$strip>]>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"resource">;
        }, z.core.$strip>>]>>;
        sessionId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        repository: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            name: z.ZodString;
            owner: z.ZodString;
            remoteUrl: z.ZodString;
        }, z.core.$strip>>>>;
        workspaceFolders: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
            name: z.ZodString;
            uri: z.ZodString;
        }, z.core.$strip>>>, z.ZodTransform<{
            name: string;
            uri: string;
        }[], {
            name: string;
            uri: string;
        }[]>>>>>;
        workspaceUri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        context: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            diagnostics: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
                message: z.ZodString;
                range: z.ZodObject<{
                    end: z.ZodObject<{
                        character: z.ZodInt;
                        line: z.ZodInt;
                    }, z.core.$strip>;
                    start: z.ZodObject<{
                        character: z.ZodInt;
                        line: z.ZodInt;
                    }, z.core.$strip>;
                }, z.core.$strip>;
                severity: z.ZodUnion<readonly [z.ZodLiteral<"error">, z.ZodLiteral<"warning">, z.ZodLiteral<"information">, z.ZodLiteral<"hint">]>;
                uri: z.ZodString;
            }, z.core.$strip>>>, z.ZodTransform<{
                message: string;
                range: {
                    end: {
                        character: number;
                        line: number;
                    };
                    start: {
                        character: number;
                        line: number;
                    };
                };
                severity: "error" | "warning" | "information" | "hint";
                uri: string;
            }[], {
                message: string;
                range: {
                    end: {
                        character: number;
                        line: number;
                    };
                    start: {
                        character: number;
                        line: number;
                    };
                };
                severity: "error" | "warning" | "information" | "hint";
                uri: string;
            }[]>>>>>;
            editHistory: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
                diff: z.ZodString;
                uri: z.ZodString;
            }, z.core.$strip>>>, z.ZodTransform<{
                diff: string;
                uri: string;
            }[], {
                diff: string;
                uri: string;
            }[]>>>>>;
            openFiles: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
                languageId: z.ZodString;
                lastFocusedMs: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
                uri: z.ZodString;
                visibleRange: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                    end: z.ZodObject<{
                        character: z.ZodInt;
                        line: z.ZodInt;
                    }, z.core.$strip>;
                    start: z.ZodObject<{
                        character: z.ZodInt;
                        line: z.ZodInt;
                    }, z.core.$strip>;
                }, z.core.$strip>>>>;
            }, z.core.$strip>>>, z.ZodTransform<{
                languageId: string;
                uri: string;
                lastFocusedMs?: number | null | undefined;
                visibleRange?: {
                    end: {
                        character: number;
                        line: number;
                    };
                    start: {
                        character: number;
                        line: number;
                    };
                } | null | undefined;
            }[], {
                languageId: string;
                uri: string;
                lastFocusedMs?: number | null | undefined;
                visibleRange?: {
                    end: {
                        character: number;
                        line: number;
                    };
                    start: {
                        character: number;
                        line: number;
                    };
                } | null | undefined;
            }[]>>>>>;
            recentFiles: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
                languageId: z.ZodString;
                text: z.ZodString;
                uri: z.ZodString;
            }, z.core.$strip>>>, z.ZodTransform<{
                languageId: string;
                text: string;
                uri: string;
            }[], {
                languageId: string;
                text: string;
                uri: string;
            }[]>>>>>;
            relatedSnippets: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
                excerpts: z.ZodArray<z.ZodObject<{
                    endLine: z.ZodInt;
                    startLine: z.ZodInt;
                    text: z.ZodString;
                }, z.core.$strip>>;
                uri: z.ZodString;
            }, z.core.$strip>>>, z.ZodTransform<{
                excerpts: {
                    endLine: number;
                    startLine: number;
                    text: string;
                }[];
                uri: string;
            }[], {
                excerpts: {
                    endLine: number;
                    startLine: number;
                    text: string;
                }[];
                uri: string;
            }[]>>>>>;
            userActions: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
                action: z.ZodString;
                position: z.ZodObject<{
                    character: z.ZodInt;
                    line: z.ZodInt;
                }, z.core.$strip>;
                timestampMs: z.ZodNumber;
                uri: z.ZodString;
            }, z.core.$strip>>>, z.ZodTransform<{
                action: string;
                position: {
                    character: number;
                    line: number;
                };
                timestampMs: number;
                uri: string;
            }[], {
                action: string;
                position: {
                    character: number;
                    line: number;
                };
                timestampMs: number;
                uri: string;
            }[]>>>>>;
        }, z.core.$strip>>>>;
        position: z.ZodObject<{
            character: z.ZodInt;
            line: z.ZodInt;
        }, z.core.$strip>;
        selection: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
            end: z.ZodObject<{
                character: z.ZodInt;
                line: z.ZodInt;
            }, z.core.$strip>;
            start: z.ZodObject<{
                character: z.ZodInt;
                line: z.ZodInt;
            }, z.core.$strip>;
        }, z.core.$strip>>>>;
        sessionId: z.ZodString;
        triggerKind: z.ZodUnion<readonly [z.ZodLiteral<"automatic">, z.ZodLiteral<"diagnostic">, z.ZodLiteral<"manual">]>;
        uri: z.ZodString;
        version: z.ZodNumber;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        sessionId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        connectionId: z.ZodString;
        method: z.ZodString;
        params: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>, z.ZodUnknown]>>>;
}, z.core.$strip>;
/**
 * Request to write content to a text file.
 *
 * Only available if the client supports the `fs.writeTextFile` capability.
 */
export declare const zWriteTextFileRequest: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    content: z.ZodString;
    path: z.ZodString;
    sessionId: z.ZodString;
}, z.core.$strip>;
export declare const zAgentRequest: z.ZodObject<{
    id: z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    method: z.ZodString;
    params: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodString;
        path: z.ZodString;
        sessionId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        limit: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
        line: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
        path: z.ZodString;
        sessionId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        options: z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            kind: z.ZodUnion<readonly [z.ZodLiteral<"allow_once">, z.ZodLiteral<"allow_always">, z.ZodLiteral<"reject_once">, z.ZodLiteral<"reject_always">]>;
            name: z.ZodString;
            optionId: z.ZodString;
        }, z.core.$strip>>;
        sessionId: z.ZodString;
        toolCall: z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            content: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                content: z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$strip>>>>;
                    text: z.ZodString;
                }, z.core.$strip>, z.ZodObject<{
                    type: z.ZodLiteral<"text">;
                }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$strip>>>>;
                    data: z.ZodString;
                    mimeType: z.ZodString;
                    uri: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                }, z.core.$strip>, z.ZodObject<{
                    type: z.ZodLiteral<"image">;
                }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$strip>>>>;
                    data: z.ZodString;
                    mimeType: z.ZodString;
                }, z.core.$strip>, z.ZodObject<{
                    type: z.ZodLiteral<"audio">;
                }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$strip>>>>;
                    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    name: z.ZodString;
                    size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    uri: z.ZodString;
                }, z.core.$strip>, z.ZodObject<{
                    type: z.ZodLiteral<"resource_link">;
                }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                    annotations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        audience: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodEnum<{
                            assistant: "assistant";
                            user: "user";
                        }>>>, z.ZodTransform<("assistant" | "user")[], ("assistant" | "user")[]>>>>>;
                        lastModified: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        priority: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                    }, z.core.$strip>>>>;
                    resource: z.ZodUnion<readonly [z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        text: z.ZodString;
                        uri: z.ZodString;
                    }, z.core.$strip>, z.ZodObject<{
                        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                        blob: z.ZodString;
                        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                        uri: z.ZodString;
                    }, z.core.$strip>]>;
                }, z.core.$strip>, z.ZodObject<{
                    type: z.ZodLiteral<"resource">;
                }, z.core.$strip>>]>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"content">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                newText: z.ZodString;
                oldText: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                path: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"diff">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                terminalId: z.ZodString;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"terminal">;
            }, z.core.$strip>>]>>>, z.ZodTransform<(({
                content: ({
                    text: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                } & {
                    type: "text";
                }) | ({
                    data: string;
                    mimeType: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                    uri?: string | null | undefined;
                } & {
                    type: "image";
                }) | ({
                    data: string;
                    mimeType: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                } & {
                    type: "audio";
                }) | ({
                    name: string;
                    uri: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                    description?: string | null | undefined;
                    mimeType?: string | null | undefined;
                    size?: number | null | undefined;
                    title?: string | null | undefined;
                } & {
                    type: "resource_link";
                }) | ({
                    resource: {
                        blob: string;
                        uri: string;
                        _meta?: Record<string, unknown> | null | undefined;
                        mimeType?: string | null | undefined;
                    } | {
                        text: string;
                        uri: string;
                        _meta?: Record<string, unknown> | null | undefined;
                        mimeType?: string | null | undefined;
                    };
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                } & {
                    type: "resource";
                });
                _meta?: Record<string, unknown> | null | undefined;
            } & {
                type: "content";
            }) | ({
                newText: string;
                path: string;
                _meta?: Record<string, unknown> | null | undefined;
                oldText?: string | null | undefined;
            } & {
                type: "diff";
            }) | ({
                terminalId: string;
                _meta?: Record<string, unknown> | null | undefined;
            } & {
                type: "terminal";
            }))[], (({
                content: ({
                    text: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                } & {
                    type: "text";
                }) | ({
                    data: string;
                    mimeType: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                    uri?: string | null | undefined;
                } & {
                    type: "image";
                }) | ({
                    data: string;
                    mimeType: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                } & {
                    type: "audio";
                }) | ({
                    name: string;
                    uri: string;
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                    description?: string | null | undefined;
                    mimeType?: string | null | undefined;
                    size?: number | null | undefined;
                    title?: string | null | undefined;
                } & {
                    type: "resource_link";
                }) | ({
                    resource: {
                        blob: string;
                        uri: string;
                        _meta?: Record<string, unknown> | null | undefined;
                        mimeType?: string | null | undefined;
                    } | {
                        text: string;
                        uri: string;
                        _meta?: Record<string, unknown> | null | undefined;
                        mimeType?: string | null | undefined;
                    };
                    _meta?: Record<string, unknown> | null | undefined;
                    annotations?: {
                        _meta?: Record<string, unknown> | null | undefined;
                        audience?: ("assistant" | "user")[] | null | undefined;
                        lastModified?: string | null | undefined;
                        priority?: number | null | undefined;
                    } | null | undefined;
                } & {
                    type: "resource";
                });
                _meta?: Record<string, unknown> | null | undefined;
            } & {
                type: "content";
            }) | ({
                newText: string;
                path: string;
                _meta?: Record<string, unknown> | null | undefined;
                oldText?: string | null | undefined;
            } & {
                type: "diff";
            }) | ({
                terminalId: string;
                _meta?: Record<string, unknown> | null | undefined;
            } & {
                type: "terminal";
            }))[]>>>>>;
            kind: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"read">, z.ZodLiteral<"edit">, z.ZodLiteral<"delete">, z.ZodLiteral<"move">, z.ZodLiteral<"search">, z.ZodLiteral<"execute">, z.ZodLiteral<"think">, z.ZodLiteral<"fetch">, z.ZodLiteral<"switch_mode">, z.ZodLiteral<"other">]>>>>;
            locations: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodArray<z.ZodCatch<z.ZodObject<{
                _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
                line: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
                path: z.ZodString;
            }, z.core.$strip>>>, z.ZodTransform<{
                path: string;
                _meta?: Record<string, unknown> | null | undefined;
                line?: number | null | undefined;
            }[], {
                path: string;
                _meta?: Record<string, unknown> | null | undefined;
                line?: number | null | undefined;
            }[]>>>>>;
            rawInput: z.ZodOptional<z.ZodUnknown>;
            rawOutput: z.ZodOptional<z.ZodUnknown>;
            status: z.ZodCatch<z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"pending">, z.ZodLiteral<"in_progress">, z.ZodLiteral<"completed">, z.ZodLiteral<"failed">]>>>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            toolCallId: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        args: z.ZodOptional<z.ZodArray<z.ZodString>>;
        command: z.ZodString;
        cwd: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        env: z.ZodOptional<z.ZodArray<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            name: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>>;
        outputByteLimit: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        sessionId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        sessionId: z.ZodString;
        terminalId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        sessionId: z.ZodString;
        terminalId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        sessionId: z.ZodString;
        terminalId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        sessionId: z.ZodString;
        terminalId: z.ZodString;
    }, z.core.$strip>, z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodIntersection<z.ZodUnion<readonly [z.ZodObject<{
        sessionId: z.ZodString;
        toolCallId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
        requestId: z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    }, z.core.$strip>]>, z.ZodObject<{
        requestedSchema: z.ZodObject<{
            description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            properties: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
                default: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                enum: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
                format: z.ZodOptional<z.ZodNullable<z.ZodUnion<readonly [z.ZodLiteral<"email">, z.ZodLiteral<"uri">, z.ZodLiteral<"date">, z.ZodLiteral<"date-time">]>>>;
                maxLength: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
                minLength: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
                oneOf: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
                    const: z.ZodString;
                    title: z.ZodString;
                }, z.core.$strip>>>>;
                pattern: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"string">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"number">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                default: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                maximum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                minimum: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"integer">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                default: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"boolean">;
            }, z.core.$strip>>, z.ZodIntersection<z.ZodObject<{
                default: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
                description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                items: z.ZodUnion<readonly [z.ZodObject<{
                    enum: z.ZodArray<z.ZodString>;
                    type: z.ZodLiteral<"string">;
                }, z.core.$strip>, z.ZodObject<{
                    anyOf: z.ZodArray<z.ZodObject<{
                        const: z.ZodString;
                        title: z.ZodString;
                    }, z.core.$strip>>;
                }, z.core.$strip>]>;
                maxItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                minItems: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
                title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"array">;
            }, z.core.$strip>>]>>>>;
            required: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            type: z.ZodDefault<z.ZodOptional<z.ZodLiteral<"object">>>;
        }, z.core.$strip>;
    }, z.core.$strip>>, z.ZodObject<{
        mode: z.ZodLiteral<"form">;
    }, z.core.$strip>>, z.ZodIntersection<z.ZodIntersection<z.ZodUnion<readonly [z.ZodObject<{
        sessionId: z.ZodString;
        toolCallId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
        requestId: z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    }, z.core.$strip>]>, z.ZodObject<{
        elicitationId: z.ZodString;
        url: z.ZodURL;
    }, z.core.$strip>>, z.ZodObject<{
        mode: z.ZodLiteral<"url">;
    }, z.core.$strip>>]>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        message: z.ZodString;
    }, z.core.$strip>>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        acpId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        connectionId: z.ZodString;
        method: z.ZodString;
        params: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        connectionId: z.ZodString;
    }, z.core.$strip>, z.ZodUnknown]>>>;
}, z.core.$strip>;
/**
 * Response to `fs/write_text_file`
 */
export declare const zWriteTextFileResponse: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
export declare const zClientResponse: z.ZodUnion<readonly [z.ZodObject<{
    id: z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
    result: z.ZodUnion<readonly [z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        content: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        outcome: z.ZodUnion<readonly [z.ZodObject<{
            outcome: z.ZodLiteral<"cancelled">;
        }, z.core.$strip>, z.ZodIntersection<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            optionId: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            outcome: z.ZodLiteral<"selected">;
        }, z.core.$strip>>]>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        terminalId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        exitStatus: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
            exitCode: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
            signal: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>>>;
        output: z.ZodString;
        truncated: z.ZodBoolean;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        exitCode: z.ZodOptional<z.ZodNullable<z.ZodInt>>;
        signal: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>, z.ZodIntersection<z.ZodUnion<readonly [z.ZodIntersection<z.ZodObject<{
        content: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString>]>>>>;
    }, z.core.$strip>, z.ZodObject<{
        action: z.ZodLiteral<"accept">;
    }, z.core.$strip>>, z.ZodObject<{
        action: z.ZodLiteral<"decline">;
    }, z.core.$strip>, z.ZodObject<{
        action: z.ZodLiteral<"cancel">;
    }, z.core.$strip>]>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        connectionId: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        _meta: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    }, z.core.$strip>, z.ZodUnknown, z.ZodUnknown]>;
}, z.core.$strip>, z.ZodObject<{
    error: z.ZodObject<{
        code: z.ZodUnion<readonly [z.ZodLiteral<-32700>, z.ZodLiteral<-32600>, z.ZodLiteral<-32601>, z.ZodLiteral<-32602>, z.ZodLiteral<-32603>, z.ZodLiteral<-32800>, z.ZodLiteral<-32000>, z.ZodLiteral<-32002>, z.ZodLiteral<-32042>, z.ZodInt]>;
        data: z.ZodOptional<z.ZodUnknown>;
        message: z.ZodString;
    }, z.core.$strip>;
    id: z.ZodNullable<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
}, z.core.$strip>]>;
