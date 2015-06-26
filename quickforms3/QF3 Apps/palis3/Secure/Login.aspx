<%@ page language="C#" masterpagefile="~/LoginMaster.master" autoeventwireup="true" inherits="Login, App_Web_login.aspx.7a311ea4" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentCenter" runat="Server">
    <h2>
        <asp:Label ID="lblTitle" runat="server" Text="PAL-IS 2 Login"></asp:Label></h2>
    <hr />
    <div class="buildVersion">
        <asp:Label ID="lblBuild" runat="server"></asp:Label></div>
    <p>
    </p>
    <asp:Panel ID="pnlLogin" runat="server">
        <asp:Label ID="lblSessionExpired" runat="server" SkinID="FeedbackError" Text="Your session has expired. Please login to continue."
            EnableViewState="false" Visible="false" />
        <asp:Login ID="Login2" runat="server">
            <LayoutTemplate>
                <table border="0" cellpadding="1" cellspacing="0" style="border-collapse: collapse;">
                    <tr>
                        <td>
                            <table border="0" cellpadding="3">
                                <tr>
                                    <td align="right">
                                        <h4>
                                            <asp:Label ID="UserNameLabel" runat="server" AssociatedControlID="UserName">User Name:</asp:Label></h4>
                                    </td>
                                    <td>
                                        <asp:TextBox ID="UserName" runat="server" Width="200px"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="UserNameRequired" runat="server" ControlToValidate="UserName"
                                            ErrorMessage="User Name is required." ToolTip="User Name is required." ValidationGroup="Login1">*</asp:RequiredFieldValidator>
                                        <asp:CustomValidator ID="CustomValidator1" runat="server" ErrorMessage="Username cannot contain any spaces."
                                            ControlToValidate="UserName" ValidationGroup="Login1" OnServerValidate="customValPassword_ServerValidate">*</asp:CustomValidator>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="right">
                                        <h4>
                                            <asp:Label ID="PasswordLabel" runat="server" AssociatedControlID="Password">Password:</asp:Label></h4>
                                    </td>
                                    <td>
                                        <asp:TextBox ID="Password" runat="server" TextMode="Password" Width="200px"></asp:TextBox>
                                        <asp:RequiredFieldValidator ID="PasswordRequired" runat="server" ControlToValidate="Password"
                                            ErrorMessage="Password is required." ToolTip="Password is required." ValidationGroup="Login1">*</asp:RequiredFieldValidator>
                                        <asp:CustomValidator ID="customValPassword" runat="server" ErrorMessage="Password cannot contain any spaces."
                                            ControlToValidate="Password" ValidationGroup="Login1" OnServerValidate="customValPassword_ServerValidate">*</asp:CustomValidator>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                    </td>
                                    <td align="left">
                                        <asp:Button ID="LoginButton" runat="server" SkinID="Buttons" CommandName="Login"
                                            Text="Log In" ValidationGroup="Login1" Width="100px" />
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" colspan="2" style="color: Red;">
                                        <asp:Literal ID="FailureText" runat="server" EnableViewState="False"></asp:Literal>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </LayoutTemplate>
        </asp:Login>
    </asp:Panel>
    <asp:Panel ID="pnlSessionExpired" runat="server" Visible="false">
        <table border="0" cellpadding="1" cellspacing="0" style="border-collapse: collapse;">
            <tr>
                <td style="width: 16px;">
                    <asp:Image ID="imgLog" runat="server" ImageUrl="~/Images/Icons/warning.gif" />
                </td>
                <td>
                    You are seeing this page because either your session has expired or you do not have
                    sufficient permissions to access the page. Please save your work on regular basis
                    in order to avoid data loss and session timeouts.
                    <p>
                    </p>
                    You are already logged on.
                    <asp:HyperLink ID="lnkSearchPatients" runat="server" NavigateUrl="~/Default.aspx">Click here</asp:HyperLink>
                    to search for patient.
                </td>
            </tr>
        </table>
    </asp:Panel>
    <p>
    </p>
    <hr />
    <asp:HyperLink ID="lnkPasswordRecovery" runat="server" NavigateUrl="~/Secure/PasswordRecovery.aspx">Forgot your password?</asp:HyperLink>
</asp:content>
