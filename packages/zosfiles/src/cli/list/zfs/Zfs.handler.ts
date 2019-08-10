/*
* This program and the accompanying materials are made available under the terms of the
* Eclipse Public License v2.0 which accompanies this distribution, and is available at
* https://www.eclipse.org/legal/epl-v20.html
*
* SPDX-License-Identifier: EPL-2.0
*
* Copyright Contributors to the Zowe Project.
*
*/

import { AbstractSession, IHandlerParameters, TextUtils } from "@zowe/imperative";
import { IZosFilesResponse, ZosFilesMessages } from "../../../api";
import { List } from "../../../api/methods/list";
import { ZosFilesBaseHandler } from "../../ZosFilesBase.handler";

/**
 * Handler to list a data sets
 * @export
 */
export default class ZfsHandler extends ZosFilesBaseHandler {
    public async processWithSession(commandParameters: IHandlerParameters, session: AbstractSession): Promise<IZosFilesResponse> {
        let response;
        if (commandParameters.arguments.path)
        {
            response = await List.zfsWithPath(session, {
                path: commandParameters.arguments.path,
                fsname: null,
                maxLength: commandParameters.arguments.maxLength
            });
        }
        else
        {
            response = await List.zfs(session, {
                path: null,
                fsname: commandParameters.arguments.fsname,
                maxLength: commandParameters.arguments.maxLength
            });
        }

        if (response.apiResponse.items.length > 0) {
            commandParameters.response.console.log(TextUtils.prettyJson(response.apiResponse.items));
        } else {
            commandParameters.response.data.setObj(response);
            commandParameters.response.format.output({
                fields: ["name", "mountpoint"],
                output: response.apiResponse.items,
                format: "table"
            });
        }

        return response;
    }
}
