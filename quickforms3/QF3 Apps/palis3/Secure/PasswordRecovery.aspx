<%@ page title="PAL-IS | Password Recovery" language="C#" masterpagefile="~/LoginMaster.master" autoeventwireup="true" inherits="TeamPortal.UI.Secure.PasswordRecovery, App_Web_passwordrecovery.aspx.7a311ea4" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentCenter" runat="Server">
    <h2>
        <asp:Label ID="lblTitle" runat="server" Text="Recover Your Password"></asp:Label></h2>
    <hr />
    <div class="buildVersion">
        <asp:Label ID="lblBuild" runat="server"></asp:Label>)</div>
    <p>
    </p>
    <p>
        If you forgot your password, please contact your manager or the admin.
    </p>
    
    <asp:PasswordRecovery ID="PasswordRecovery1" runat="server" Visible="false">
        <UserNameTemplate>
            <h3>
                Step 1: Enter your username</h3>
            <p>
            </p>
            <table cellpadding="2">
                <tr>
                    <td style="width: 80px;">
                        <asp:Label runat="server" ID="lblUsername" AssociatedControlID="UserName" Text="Username:" />
                    </td>
                    <td style="width: 200px;">
                        <asp:TextBox ID="UserName" runat="server" Width="100%"></asp:TextBox>
                    </td>
                    <td>
                        <asp:RequiredFieldValidator ID="valRequireUserName" runat="server" ControlToValidate="UserName"
                            SetFocusOnError="true" Display="Dynamic" ErrorMessage="Username is required."
                            ToolTip="Username is required." ValidationGroup="PasswordRecovery1">*</asp:RequiredFieldValidator>
                    </td>
                </tr>
                <td colspan="3" style="text-align: right;">
                    <asp:Label ID="FailureText" runat="server" SkinID="FeedbackError" EnableViewState="False" />
                    <asp:Button ID="SubmitButton" runat="server" SkinID="Buttons" CommandName="Submit"
                        Text="Submit" ValidationGroup="PasswordRecovery1" />
                </td>
            </table>
        </UserNameTemplate>
        <QuestionTemplate>
            <h3>
                Step 2: Answer the following question</h3>
            <p>
            </p>
            <table cellpadding="2">
                <tr>
                    <td style="width: 80px;">
                        Username:
                    </td>
                    <td style="width: 200px;">
                        <asp:Literal ID="UserName" runat="server"></asp:Literal>
                    </td>
                    <td>
                    </td>
                </tr>
                <tr>
                    <td>
                        <asp:Label runat="server" ID="lblQuestion" AssociatedControlID="Question" Text="Question:" />
                    </td>
                    <td>
                        <asp:Literal ID="Question" runat="server"></asp:Literal>
                    </td>
                    <td>
                    </td>
                </tr>
                <tr>
                    <td>
                        <asp:Label runat="server" ID="lblAnswer" AssociatedControlID="Answer" Text="Answer:" />
                    </td>
                    <td>
                        <asp:TextBox ID="Answer" runat="server" Width="100%"></asp:TextBox>
                    </td>
                    <td>
                        <asp:RequiredFieldValidator ID="valRequireAnswer" runat="server" ControlToValidate="Answer"
                            SetFocusOnError="true" ErrorMessage="Answer is required." ToolTip="Answer is required."
                            ValidationGroup="PasswordRecovery1">*</asp:RequiredFieldValidator>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" style="text-align: right;">
                        <asp:Label ID="FailureText" runat="server" SkinID="FeedbackError" EnableViewState="False" />
                        <asp:Button ID="SubmitButton" runat="server" SkinID="Buttons" CommandName="Submit"
                            Text="Submit" ValidationGroup="PasswordRecovery1" />
                    </td>
                </tr>
            </table>
        </QuestionTemplate>
        <SuccessTemplate>
            <asp:Label runat="server" ID="lblSuccess" SkinID="FeedbackOK" Text="Your password has been sent to your e-mail." />
            <p>
            </p>
            <asp:HyperLink ID="lnkLogin" runat="server" NavigateUrl="~/Secure/Login.aspx">Click
                                here</asp:HyperLink>
            to login.
            
        </SuccessTemplate>
    </asp:PasswordRecovery>
    <p>
    </p>
    <hr />
    <p>
    </p>
    
</asp:Content>
