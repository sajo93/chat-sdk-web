import * as angular from 'angular';
import { database } from 'firebase';

import * as PathKeys from '../keys/path-keys';
import * as Keys from '../keys/keys';
import { N } from '../keys/notification-keys';
import { Entity, IEntity } from './entity';
import { userUID } from '../keys/keys';
import { UserKeys } from '../keys/user-keys';
import { UserAllowInvites } from '../keys/allow-invite-type';
import { Utils } from '../services/utils';
import { IRoom } from './room';
import { RoomKeys } from '../keys/room-keys';
import { IRootScope } from '../interfaces/root-scope';
import { IPaths } from '../network/paths';
import { ICloudImage } from '../services/cloud-image';
import { IEnvironment } from '../services/environment';
import { INetworkManager } from '../network/network-manager';
import { IStringAnyObject } from '../interfaces/string-any-object';

export interface IUser extends IEntity {
  blocked: boolean;
  friend?: boolean;
  meta: Map<string, any>;
  online: boolean;
  ssoFriend?: boolean;
  addFriend(friend: IUser): Promise<any>;
  addRoomUpdate(room: IRoom): {};
  allowInvitesFrom(type: UserAllowInvites): boolean;
  blockUser(user: IUser): void;
  canBeInvitedByUser(invitingUser: IUser): boolean;
  deserialize(su): void;
  getImageURL(): string;
  getName(): string;
  getProfileHTML(): string;
  getProfileLink(): string;
  hasImage(): boolean;
  isMe(): boolean;
  markRoomReadTime(rid: string): Promise<any>;
  name(value: string): string;
  off(): void;
  on(): Promise<any>;
  pushMeta(): Promise<any>;
  removeFriend(friend?: IUser): void;
  removeRoomUpdate(room: IRoom): {};
  setImage(image: string, isData?: boolean): void;
  setImageURL(imageURL: string): void;
  setName(name: string): void;
  setProfileHTML(profileHTML: string): void;
  uid(): string;
  unblock(): void;
  unblockUser(user: IUser): void;
  updateImageURL(imageURL: string): Promise<any>;
}

class User extends Entity implements IUser {

  public meta = new Map<string, any>();
  public online: boolean;
  private image: string;
  public blocked: boolean;
  unblock: () => void = null;

  constructor(
    private $rootScope: IRootScope,
    Paths: IPaths,
    private CloudImage: ICloudImage,
    private Environment: IEnvironment,
    private NetworkManager: INetworkManager,
    uid: string,
  ) {
    super(Paths, PathKeys.UsersPath, uid);

    this.setImageURL(Environment.defaultProfilePictureURL());
    this.setUID(uid);
    this.setAllowInvites(UserAllowInvites.Everyone);
  }

  getName(): string {
    return this.getMetaValue(UserKeys.Name);
  }

  setName(name: string) {
    this.setMetaValue(UserKeys.Name, name);
  }

  name(value: string): string {
    if (Utils.unORNull(value)) {
      return this.getName();
    }
    else {
      this.setName(value);
    }
  }

  getStatus() {
    return this.getMetaValue(UserKeys.Status);
  }

  setStatus(status: string) {
    return this.setMetaValue(UserKeys.Status, status);
  }

  // For Angular getterSetter binding
  status(value: string) {
    if (Utils.unORNull(value)) {
      return this.getStatus();
    }
    else {
      this.setStatus(value);
    }
  }

  getLocation() {
    return this.getMetaValue(UserKeys.Location);
  }

  setLocation(location) {
    return this.setMetaValue(UserKeys.Location, location);
  }

  location(value) {
    if (Utils.unORNull(value)) {
      return this.getLocation();
    }
    else {
      this.setLocation(value);
    }
  }

  getCountryCode(): string {
    return this.getMetaValue(UserKeys.CountryCode);
  }

  setCountryCode(countryCode: string) {
    return this.setMetaValue(UserKeys.CountryCode, countryCode);
  }

  countryCode(value: string) {
    if (Utils.unORNull(value)) {
      return this.getCountryCode();
    }
    else {
      this.setCountryCode(value);
    }
  }

  getGender(): string {
    return this.getMetaValue(UserKeys.Gender);
  }

  setGender(gender: string) {
    return this.setMetaValue(UserKeys.Gender, gender);
  }

  gender(value: string) {
    if (Utils.unORNull(value)) {
      return this.getGender();
    }
    else {
      this.setGender(value);
    }
  }

  getProfileLink(): string {
    return this.getMetaValue(UserKeys.ProfileLink);
  }

  setProfileLink(profileLink: string) {
    return this.setMetaValue(UserKeys.ProfileLink, profileLink);
  }

  profileLink(value: string) {
    if (Utils.unORNull(value)) {
      return this.getProfileLink();
    }
    else {
      this.setProfileLink(value);
    }
  }

  getHomepageLink(): string {
    return this.getMetaValue(UserKeys.HomepageLink);
  }

  setHomepageLink(homepageLink: string) {
    return this.setMetaValue(UserKeys.HomepageLink, homepageLink);
  }

  homepageLink(value: string) {
    if (Utils.unORNull(value)) {
      return this.getHomepageLink();
    }
    else {
      this.setHomepageLink(value);
    }
  }

  getHomepageText(): string {
    return this.getMetaValue(UserKeys.HomepageText);
  }

  setHomepageText(homepageText: string) {
    return this.setMetaValue(UserKeys.HomepageText, homepageText);
  }

  homepageText(value: string) {
    if (Utils.unORNull(value)) {
      return this.getHomepageText();
    }
    else {
      this.setHomepageText(value);
    }
  }

  getProfileHTML(): string {
    return this.getMetaValue(UserKeys.ProfileHTML);
  }

  setProfileHTML(profileHTML: string) {
    this.setMetaValue(UserKeys.ProfileHTML, profileHTML);
  }

  profileHTML(value: string) {
    if (Utils.unORNull(value)) {
      return this.getProfileHTML();
    }
    else {
      this.setProfileHTML(value);
    }
  }

  getAllowInvites(): UserAllowInvites {
    return this.getMetaValue(UserKeys.AllowInvites);
  }

  setAllowInvites(allowInvites: UserAllowInvites) {
    return this.setMetaValue(UserKeys.AllowInvites, allowInvites);
  }

  allowInvites(value?: UserAllowInvites) {
    if (Utils.unORNull(value)) {
      return this.getAllowInvites();
    }
    else {
      this.setAllowInvites(value);
    }
  }

  getImageURL(): string {
    return this.getMetaValue(UserKeys.ImageURL);
  }

  setImageURL(imageURL: string) {
    this.setMetaValue(UserKeys.ImageURL, imageURL);
  }

  getThumbnail(): string {
    return this.CloudImage.cloudImage(this.getImageURL(), 100, 100);
  }

  imageURL(value?: string) {
    if (Utils.unORNull(value)) {
      return this.getImageURL();
    }
    else {
      this.setImageURL(value);
    }
  }

  on(): Promise<any> {

    if (this.pathIsOn[Keys.MetaKey]) {
      return;
    }

    const ref = this.Paths.userOnlineRef(this.uid());
    ref.on('value', (snapshot) => {
      if (!Utils.unORNull(snapshot.val())) {
        this.online = snapshot.val();
        if (this.online) {
          this.$rootScope.$broadcast(N.OnlineUserAdded);
        }
        else {
          this.$rootScope.$broadcast(N.OnlineUserRemoved);
        }
      }
    });

    return this.pathOn(Keys.MetaKey, (val) => {
      if (val) {
        this.setMeta(val);

        // Update the user's thumbnail
        this.setImage(this.imageURL());

        // Here we want to update the
        // - Main box
        // - Every chat room that includes the user
        // - User settings popup
        this.$rootScope.$broadcast(N.UserValueChanged, this);
      }
    });
  }

  /**
   * Stop listening to the Firebase location
   */
  off() {
    this.pathOff(Keys.MetaKey);
    this.Paths.userOnlineRef(this.uid()).off();
  }

  async pushMeta(): Promise<any> {
    const ref = this.Paths.userMetaRef(this.uid());
    try {
      await ref.update(this.getMetaObject());
      return this.updateState(Keys.MetaKey);
    }
    catch (err) {
      console.error('PushMeta\n' + err.message);
    }
  }

  canBeInvitedByUser(invitingUser: IUser): boolean {

    // This function should only ever be called on the root user
    if (!this.isMe()) {
      console.log('Can be invited should only be called on the root user');
      return false;
    }

    if (invitingUser.isMe()) {
      return true;
    }

    const allowInvites = this.allowInvites();
    return Utils.unORNull(allowInvites) || allowInvites === UserAllowInvites.Everyone;
  }

  allowInvitesFrom(type: UserAllowInvites): boolean {
    return this.allowInvites() === type;
  }

  updateImageURL(imageURL: string): Promise<any> {
    // Compare to the old URL
    const imageChanged = imageURL !== this.imageURL();
    if (imageChanged) {
      this.setMetaValue(UserKeys.ImageURL, imageURL);
      this.setImageURL(imageURL);
      this.setImage(imageURL, false);
      return this.pushMeta();
    }
  }

  setImage(image: string, isData = false): void {
    if (image === undefined) {
      // TODO: Improve this
      this.image = this.Environment.defaultProfilePictureURL();
    }
    else if (isData || image === this.Environment.defaultProfilePictureURL()) {
      this.image = image;
    }
    else {
      this.image = this.CloudImage.cloudImage(image, 100, 100);
    }
  }

  isMe(): boolean {
    return this.uid() === this.NetworkManager.auth.currentUserID();
  }

  getAvatar(): string {
    if (Utils.unORNull(this.image)) {
      return this.Environment.defaultProfilePictureURL();
    }
    return this.image;
  }

  hasImage(): boolean {
    return this.image && this.image !== this.Environment.defaultProfilePictureURL();
  }

  addRoomUpdate(room: IRoom): { [path: string]: string } {
    const path = this.relativeFirebasePath(this.roomsRef().child(room.rid()).child(RoomKeys.InvitedBy));
    return { [path]: this.NetworkManager.auth.currentUserID() };
  }

  removeRoomUpdate(room: IRoom): { [path: string]: null } {
    const path = this.relativeFirebasePath(this.roomsRef().child(room.rid()));
    return { [path]: null };
  }

  roomsRef(): firebase.database.Reference {
    return this.Paths.userRoomsRef(this.uid());
  }

  addFriend(friend: IUser): Promise<any> {
    if (friend && friend.meta && friend.uid()) {
      return this.addFriendWithUID(friend.uid());
    }
  }

  async addFriendWithUID(uid: string): Promise<any> {
    const ref = this.Paths.userFriendsRef(this.uid());
    const data = { [uid]: { uid } };

    await ref.update(data);
    return this.updateState(PathKeys.FriendsPath);
  }

  uid(): string {
    return this._id;
  }

  setUID(uid: string) {
    return this.setMetaValue(userUID, uid);
  }

  /**
   * Remove the user as a friend on which this function is being called on
   */
  removeFriend(): void;
  /**
   * Remove a specified user as a friend
   * @package friend - the user to be removed as a friend
   */
  removeFriend(friend?: IUser) {
    // This method is added to the object when the friend is
    // added initially
    friend.removeFriend();
    friend.removeFriend = null;
    this.updateState(PathKeys.FriendsPath);
  }

  blockUserWithUID(uid: string) {
    const ref = this.Paths.userBlockedRef(this.uid());
    const data = { [uid]: { uid } };

    ref.update(data).then(() => {
      return this.updateState(PathKeys.BlockedPath);
    });
  }

  markRoomReadTime(rid: string) {
    const ref = this.Paths.userRoomsRef(this.uid()).child(rid);
    const data = { [Keys.ReadKey]: database.ServerValue.TIMESTAMP };
    return ref.update(data);
  }

  blockUser(user: IUser) {
    if (user && user.meta && user.uid()) {
      this.blockUserWithUID(user.uid());
    }
  }

  unblockUser(user: IUser): void {
    user.unblock();
    user.unblock = null;
    this.updateState(PathKeys.BlockedPath);
  }

  serialize(): IStringAnyObject {
    return super.serialize();
  }

  deserialize(su: IStringAnyObject) {
    if (su) {
      super.deserialize(su._super);
      this.setImage(su.meta[UserKeys.ImageURL]);
    }
  }

}

export interface IUserFactory {
  createUser(uid: string): IUser;
}

class UserFactory implements IUserFactory {

  static $inject = ['$rootScope', 'Paths', 'CloudImage', 'Environment', 'NetworkManager'];

  constructor(
    private $rootScope: IRootScope,
    private Paths: IPaths,
    private CloudImage: ICloudImage,
    private Environment: IEnvironment,
    private NetworkManager: INetworkManager,
  ) { }

  createUser(uid: string): IUser {
    return new User(this.$rootScope, this.Paths, this.CloudImage, this.Environment, this.NetworkManager, uid);
  }

}

angular.module('myApp.services').service('UserFactory', UserFactory);
